const express = require('express');
const path = require('path');
const os = require('os');
const app = express();
const port = 3088;

// 获取本机IP地址
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // 跳过非IPv4和内部地址
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

// 设置静态文件目录
app.use(express.static('.'));

// 添加一个简单的文件列表页面
app.get('/', (req, res) => {
  const currentDir = process.cwd();
  const fs = require('fs');

  fs.readdir(currentDir, (err, files) => {
    if (err) {
      res.send('Error reading directory');
      return;
    }

    // 过滤出 APK 文件
    const apkFiles = files.filter(file => file.endsWith('.apk'));

    // 创建一个简单的 HTML 页面
    let html = '<html><head><title>APK 下载</title></head><body>';
    html += '<h2>可用的 APK 文件：</h2><ul>';

    apkFiles.forEach(file => {
      html += `<li><a href="${file}">${file}</a></li>`;
    });

    html += '</ul></body></html>';
    res.send(html);
  });
});

// 启动服务器
app.listen(port, () => {
  const localIP = getLocalIP();
  console.log(`服务器已启动！`);
  console.log(`请在平板浏览器中访问：http://${localIP}:${port}`);
  console.log(`或者使用本地地址：http://localhost:${port}`);
});