const {
  ipcMain,
  BrowserWindow,
  ipcRenderer
} = require('electron');
var mainWindow = BrowserWindow.getFocusedWindow();

//监听窗口变化
mainWindow.on('resize', () => {
  if (!mainWindow.isMaximized()) {
    BrowserWindow.getFocusedWindow().webContents.send('restoreMaximize', 'restore');
  } else {
    BrowserWindow.getFocusedWindow().webContents.send('restoreMaximize', 'maximize');
  }
})
//置顶
ipcMain.on('window-top', () => {
  if (mainWindow.isAlwaysOnTop()) {
    mainWindow.setAlwaysOnTop(false);
    BrowserWindow.getFocusedWindow().webContents.send('alwaysOnTop', 'no');
  } else {
    mainWindow.setAlwaysOnTop(true);
    BrowserWindow.getFocusedWindow().webContents.send('alwaysOnTop', 'yes');
  }
});

//最小化
ipcMain.on('window-min', () => {
  mainWindow.minimize();
});

//最大化
ipcMain.on('window-max', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
    //主进程 个渲染进程 发送数据
    BrowserWindow.getFocusedWindow().webContents.send('restoreMaximize', 'restore');
  } else {
    mainWindow.maximize();
    //主进程 个渲染进程 发送数据
    BrowserWindow.getFocusedWindow().webContents.send('restoreMaximize', 'maximize');
  }
});
//关闭
ipcMain.on('window-close', () => {
  mainWindow.close();
});
