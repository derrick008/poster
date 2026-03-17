const { contextBridge, ipcRenderer } = require('electron');

// 暴露给渲染进程的API
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取assets文件夹路径
  getAssetsPath: () => ipcRenderer.invoke('get-assets-path'),
  
  // 选择文件夹并加载assets（从指定路径开始）
  selectAndLoadAssets: (startPath) => ipcRenderer.invoke('select-and-load-assets', startPath),
  
  // 读取本地 layout.json（优先 app/layout.json）
  loadLayoutJson: () => ipcRenderer.invoke('load-layout-json'),
  // 保存布局到 app/layout.json
  saveLayoutJson: (layoutObj) => ipcRenderer.invoke('save-layout-json', layoutObj)
});
