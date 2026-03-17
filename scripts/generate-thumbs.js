const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, '..', 'app', 'assets');
const files = ['f1.png', 'f2.png', 'f3.png', 'j1.png', 'j2.png', 'j3.png'];
const scale = 0.2;

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('请先执行: npm install');
    process.exit(1);
  }
  for (const f of files) {
    const src = path.join(assetsDir, f);
    const dest = path.join(assetsDir, f.replace('.png', '-thumb.png'));
    if (!fs.existsSync(src)) {
      console.warn('跳过（不存在）:', f);
      continue;
    }
    try {
      const meta = await sharp(src).metadata();
      const w = Math.round((meta.width || 1080) * scale);
      const h = Math.round((meta.height || 1920) * scale);
      await sharp(src)
        .resize(w, h)
        .png({ quality: 80 })
        .toFile(dest);
      console.log('生成:', f, '->', path.basename(dest));
    } catch (err) {
      console.error('失败', f, err.message);
    }
  }
  console.log('缩略图生成完成。');
}

main();
