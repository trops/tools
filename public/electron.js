const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');

// My library of functions
const { showDialogChooseXMLFile, parseXMLFileChosen, parseXMLFileChosenWithNode } = require('./lib/dialogController');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth:800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      //webSecurity: false,
      allowRunningInsecureContent: false
    }
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  /*
    * handlers 
    */

    ipcMain.handle("showDialogChooseXMLFile", (e, message) => {
      showDialogChooseXMLFile(win, message);
      e.sender.send("Got your message");
    });

    ipcMain.handle("choseXMLFile", (e, message) => {

    });

    /**
     * Parse the XML filepath chosen by the user
     */
    ipcMain.handle("parseXMLFileChosen", (e, message) => {
      parseXMLFileChosen(win, message);
    });

    ipcMain.handle("parseXMLFileChosenWithNode", (e, message) => {
      parseXMLFileChosenWithNode(win, message);
    });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});