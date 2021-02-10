const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  ipcRenderer,
  Notification,
  screen
} = require('electron'); //引入electron
var packageInfo = require("./package.json");
const {
  autoUpdater
} = require('electron-updater')
let uploadUrl = 'http://127.0.0.1:8848/update/';
let mainWindow;

let miniWin;

let loopTime; //

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
  mainWindow = new BrowserWindow(windowConfig); //创建一个窗口
  mainWindow.loadURL(`file://${__dirname}/index.html`); //在窗口内要展示的内容index.html 就是打包生成的index.html
  //mainWindow.webContents.openDevTools(); //开启调试工具
  mainWindow.on('close', () => {
    //回收BrowserWindow对象
    mainWindow = null;
  });
  //监听窗口变化
  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      mainWindow.webContents.send('restoreMaximize', 'restore');
    } else {
      mainWindow.webContents.send('restoreMaximize', 'maximize');
    }
  })
  updateHandle();
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow == null) {
    createWindow();
  }
});


//置顶
ipcMain.on('window-top', () => {
  if (mainWindow.isAlwaysOnTop()) {
    mainWindow.setAlwaysOnTop(false);
    mainWindow.webContents.send('alwaysOnTop', 'no');
  } else {
    mainWindow.setAlwaysOnTop(true);
    mainWindow.webContents.send('alwaysOnTop', 'yes');
  }
});

//最小化
ipcMain.on('window-min', () => {
  mainWindow.minimize();
});

ipcMain.on('show-notification', (event, args) => {
  if (Notification.isSupported()) {
    console.log('通知')
    var notification = new Notification({
      title: args.title,
      body: args.body
    })
    notification.show()
  }
});

//最大化
ipcMain.on('window-max', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
    //主进程 个渲染进程 发送数据
    mainWindow.webContents.send('restoreMaximize', 'restore');
  } else {
    mainWindow.maximize();
    //主进程 个渲染进程 发送数据
    mainWindow.webContents.send('restoreMaximize', 'maximize');
  }
});
ipcMain.on('get-app-info', () => {
  mainWindow.webContents.send('get-app-info-back', packageInfo);
});
//关闭
ipcMain.on('window-close', () => {
  mainWindow.close();
});


//+++++++++++++++++++++++悬浮工具 start ++++++++++++++++++++++++++++++++++++++
ipcMain.on('main-win-open', () => {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 720,
      minWidth: 400,
      minHeight: 400,
      frame: false,
      webPreferences: {
        nodeIntegration: true, // 是否集成 Nodejs,把之前预加载的js去了，发现也可以运行
      }
    })
    mainWindow.loadURL(`file://${__dirname}/index.html`); //在窗口内要展示的内容index.html 就是打包生成的index.html
    mainWindow.on('closed', () => {
      mainWindow = null
    })
  } else {
    mainWindow.show();
  }
});

ipcMain.on('open-tool-win', () => {
  const winURL = process.env.NODE_ENV === 'development' ?
    'http://localhost:8080' :
    `file://${__dirname}/index.html`;
  // 定义calendar窗体
  if (!miniWin) {
    var w = screen.getPrimaryDisplay().workAreaSize.width - 700;
    miniWin = new BrowserWindow({
      width: 350,
      maxWidth: 400,
      minWidth: 300,
      height: 200,
      frame: false,
      skipTaskbar: true,
      x: w,
      y: 0,
      transparent: true,
      webPreferences: {
        nodeIntegration: true
      }
    })
    //miniWin.webContents.openDevTools(); //开启调试工具
    miniWin.setAlwaysOnTop(true)
    miniWin.loadURL(winURL + '#/miniTool')
    miniWin.on('closed', () => {
      miniWin = null
    })
    miniWin.on('resized', () => {
      miniWin.webContents.send('mini-resize');
    })
    miniWin.on('blur', (e) => {
      var top = miniWin.getPosition()[1];
      if (top <= 0) {
        miniWin.webContents.send('mini-top', 'true');
      }
    })
    miniWin.on('focus', (e) => {
      var top = miniWin.getPosition()[1];
      if (top <= 0) {
        miniWin.webContents.send('mini-top', 'false');
      }
    })
  }
});

ipcMain.on('mini-win-show', () => {
  miniWin.show();
});

ipcMain.on('mini-win-mouse-leve', () => {
  var top = miniWin.getPosition()[1];
  if (top <= 0) {
    miniWin.webContents.send('mini-top', 'true');
  }
});

ipcMain.on('mini-win-ignore-mouse', () => {
  miniWin.setIgnoreMouseEvents(true, {
    forward: true
  })
});

ipcMain.on('mini-win-close-ignore-mouse', () => {
  miniWin.setIgnoreMouseEvents(false)
});

ipcMain.on('mini-set-size', (event, args) => {
  miniWin.setSize(miniWin.getSize()[0], args, true)
});

ipcMain.on('mini-max-height', (event, args) => {
  miniWin.setSize(miniWin.getSize()[0], screen.getPrimaryDisplay().workAreaSize.height, true)
});

ipcMain.on('mini-close', (event, args) => {
  miniWin.close();
});

ipcMain.on('mini-set-top', (event, args) => {
  miniWin.setAlwaysOnTop(args)
});

//刷新悬浮任务
ipcMain.on('mini-plane-refresh', (event, args) => {
  if (miniWin) {
    miniWin.webContents.send('mini-plane-refresh-call');
  }
});
//刷新任务
ipcMain.on('main-plane-refresh', (event, args) => {
  if (mainWindow) {
    mainWindow.webContents.send('main-plane-refresh-call');
  }
});
//+++++++++++++++++++++++悬浮工具 end ++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++更新 start ++++++++++++++++++++++++++++++

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
  let message = {
    error: 'error',
    checking: 'checking……',
    updateAva: 'updateAva……',
    updateNotAva: 'updateNotAva',
  };
  const os = require('os');

  autoUpdater.setFeedURL(uploadUrl);

  console.log(11)
  console.log(autoUpdater)
  console.log(uploadUrl)
  console.log(11)
  autoUpdater.on('error', function(error) {
    sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function() {
    sendUpdateMessage(message.checking)
  });
  autoUpdater.on('update-available', function(info) {
    sendUpdateMessage(message.updateAva)
  });
  autoUpdater.on('update-not-available', function(info) {
    sendUpdateMessage(message.updateNotAva)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
    console.log(progressObj)
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log(arguments);
      console.log("开始更新");
      //some code here to handle event
      autoUpdater.quitAndInstall();
    });

    mainWindow.webContents.send('isUpdateNow')
  });

  autoUpdater.checkForUpdates()
  ipcMain.on("checkForUpdate", () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates();
  })

}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  console.log(package.version)
  console.log(text)
  mainWindow.webContents.send('message', text)
}
