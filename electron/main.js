const {
  app,
  BrowserWindow,
  Menu
} = require('electron'); //引入electron

let win;
let windowConfig = {
  width: 1000,
  height: 720,
  minWidth: 400,
  minHeight: 400,
  frame: false,
  webPreferences: {
    nodeIntegration: true, // 是否集成 Nodejs,把之前预加载的js去了，发现也可以运行
  }
}; //窗口配置程序运行窗口的大小
function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow(windowConfig); //创建一个窗口
  win.loadURL(`file://${__dirname}/index.html`); //在窗口内要展示的内容index.html 就是打包生成的index.html
  //win.webContents.openDevTools(); //开启调试工具
  win.on('close', () => {
    //回收BrowserWindow对象
    win = null;
  });
  win.on('resize', () => {
    // win.reload();
  })
  require('./ipcMain');
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  app.quit();
});
app.on('activate', () => {
  if (win == null) {
    createWindow();
  }
});
