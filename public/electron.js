const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const { parseXmlMainEvents, menuEvents } = require('./js/events');

// My library of functions
const { 
  showDialogChooseXMLFile, 
  parseXMLFileChosen, 
  parseXMLFileChosenWithNode 
} = require('./lib/dialogController');

const { 
  minimizeWindow,
  maxUnmaxWindow,
  closeWindow
} = require('./js/menu/menu-functions');

const { menu }  = require('./js/menu/menu');

let win;

function createWindow() {

  // lets make sure and not listen twice...
  ipcMain.removeAllListeners();

  win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth:800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "/js/preload.js"),
      contextIsolation: true,
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

  // Handle messages coming from Renderer TO Main thread

  // Message Handlers for Parse XML 
  ipcMain.handle(parseXmlMainEvents.MAIN_PARSE_XML_SHOW_DIALOG, (e, message) => showDialogChooseXMLFile(win, message));
  ipcMain.handle(parseXmlMainEvents.MAIN_PARSE_XML_CHOSE_FILE, (e, message) => parseXMLFileChosen(win, message));
  ipcMain.handle(parseXmlMainEvents.MAIN_PARSE_XML_CHOSE_FILE_WITH_NODE, (e, message) => parseXMLFileChosenWithNode(win, message));

  // When ipcRenderer sends mouse click co-ordinates, show menu at that position.
  ipcMain.handle(menuEvents.MENU_MINIMIZE_WINDOW, (e, args) => minimizeWindow());
  ipcMain.handle(menuEvents.MENU_MAXIMIZE_WINDOW, (e, args) => maxUnmaxWindow());
  ipcMain.handle(menuEvents.MENU_CLOSE_WINDOW, (e, args) => closeWindow());
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

app.on('activate', () => {
  const mainWindow = BrowserWindow.getAllWindows();
  if (mainWindow.length > 0) {
    mainWindow[0].show();
  } else {
    // Something went wrong
    app.quit();
  }
});