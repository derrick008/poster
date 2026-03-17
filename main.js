const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // 获取程序所在目录（主进程的执行目录）
  const appPath = app.getAppPath();
  let appRoot = appPath;
  
  // 处理打包后的asar包
  if (appPath.endsWith('app.asar')) {
    appRoot = path.dirname(appPath);
  }
  // Windows exe文件
  else if (appPath.endsWith('.exe')) {
    appRoot = path.dirname(appPath);
  }
  
  const assetsPath = path.join(appRoot, 'assets');

  console.log('========== 应用启动信息 ==========');
  console.log('app.getAppPath():', appPath);
  console.log('__dirname:', __dirname);
  console.log('应用根目录:', appRoot);
  console.log('预期assets路径:', assetsPath);
  console.log('assets文件夹存在:', fs.existsSync(assetsPath));
  console.log('==================================');

  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, 'assets/logo.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // CRITICAL: Allows html2canvas to read local files from assets/fonts
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
    title: "PMSmart 捷报助手"
  });

  mainWindow.loadFile('生成器.html');
}

// IPC 处理函数 - 获取assets文件夹路径
ipcMain.handle('get-assets-path', () => {
  const appPath = app.getAppPath();
  let appRoot = appPath;
  
  if (appPath.endsWith('app.asar')) {
    appRoot = path.dirname(appPath);
  } else if (appPath.endsWith('.exe')) {
    appRoot = path.dirname(appPath);
  }
  
  const assetsPath = path.join(appRoot, 'assets');
  
  console.log('get-assets-path - appRoot:', appRoot);
  console.log('get-assets-path - assetsPath:', assetsPath);
  console.log('get-assets-path - exists:', fs.existsSync(assetsPath));
  
  if (fs.existsSync(assetsPath)) {
    return assetsPath;
  }
  return null;
});

// 获取 layout.json 的读取路径（优先可写位置，再读 asar 内默认）
function getLayoutPaths() {
  const appPath = app.getAppPath();
  const isAsar = appPath.endsWith('app.asar');
  const resourcesDir = isAsar ? path.dirname(appPath) : appPath;
  return [
    path.join(resourcesDir, 'app', 'layout.json'),  // 可写位置（开发或打包后 resources/app/）
    path.join(appPath, 'app', 'layout.json'),       // asar 内默认
    path.join(appPath, 'layout.json')
  ];
}

ipcMain.handle('load-layout-json', async () => {
  for (const p of getLayoutPaths()) {
    try {
      if (fs.existsSync(p)) {
        const data = fs.readFileSync(p, 'utf8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('load-layout-json error:', p, e.message);
    }
  }
  return null;
});

ipcMain.handle('save-layout-json', async (event, layoutObj) => {
  const appPath = app.getAppPath();
  const layoutPath = appPath.endsWith('app.asar')
    ? path.join(path.dirname(appPath), 'app', 'layout.json')  // 打包后写到 resources/app/
    : path.join(appPath, 'app', 'layout.json');
  try {
    const dir = path.dirname(layoutPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(layoutPath, JSON.stringify(layoutObj, null, 2), 'utf8');
    return { ok: true };
  } catch (e) {
    console.error('save-layout-json error:', e);
    return { ok: false, error: e.message };
  }
});

// IPC 处理函数 - 选择文件夹并加载assets
ipcMain.handle('select-and-load-assets', async (event, startPath) => {
  const appPath = app.getAppPath();
  let appRoot = appPath;
  
  if (appPath.endsWith('app.asar')) {
    appRoot = path.dirname(appPath);
  } else if (appPath.endsWith('.exe')) {
    appRoot = path.dirname(appPath);
  }
  
  const defaultAssetsPath = path.join(appRoot, 'assets');
  
  const filesToLoad = [
    'logo.png',
    '房建1.png', '房建2.png', '房建3.png',
    '基建1.png', '基建2.png', '基建3.png'
  ];

  console.log('========== 初始化素材调试信息 ==========');
  console.log('应用根目录:', appRoot);
  console.log('传入的startPath:', startPath);
  console.log('默认assets路径:', defaultAssetsPath);
  console.log('最终使用的路径:', startPath || defaultAssetsPath);
  console.log('assets文件夹是否存在:', fs.existsSync(defaultAssetsPath));
  console.log('===========================================');

  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: startPath || defaultAssetsPath,
    buttonLabel: '选择 assets 文件夹',
    title: '请选择 assets 文件夹'
  });
  
  console.log('用户选择结果 - canceled:', result.canceled);
  console.log('用户选择结果 - filePaths:', result.filePaths);
  
  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const selectedPath = result.filePaths[0];
  console.log('用户选择的路径:', selectedPath);
  
  const loaded = {};
  let successCount = 0;
  let failCount = 0;

  // 读取文件夹中的文件
  for (const filename of filesToLoad) {
    const filePath = path.join(selectedPath, filename);
    console.log(`检查文件: ${filename} -> ${filePath}`);
    try {
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        // 转换为base64
        const base64 = `data:image/png;base64,${buffer.toString('base64')}`;
        loaded[filename] = base64;
        successCount++;
        console.log(`✅ 成功加载: ${filename}`);
      } else {
        failCount++;
        console.warn(`❌ 文件不存在: ${filename}`);
      }
    } catch (error) {
      failCount++;
      console.error(`❌ 加载失败 ${filename}:`, error.message);
    }
  }

  console.log('========== 加载完成 ==========');
  console.log(`成功: ${successCount}, 失败: ${failCount}`);
  console.log('==============================');

  return {
    canceled: false,
    path: selectedPath,
    loaded: loaded,
    successCount: successCount,
    failCount: failCount,
    totalFiles: filesToLoad.length,
    missingFiles: filesToLoad.filter(f => !loaded[f])
  };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
