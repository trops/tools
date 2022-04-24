const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const { parseXmlMainEvents, jsonMapMainEvents} = require('./lib/events');

// My library of functions
const { 
  showDialogChooseXMLFile, 
  parseXMLFileChosen, 
  parseXMLFileChosenWithNode,
  showDialogChooseJSONFile,
  parseJSONFileChosen,
  findKeysInJsonFile
} = require('./lib/controller');


// const { applicationMenu } = require('./lib/controller');

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
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
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

  // Message Handlers for Map Json
  ipcMain.handle(jsonMapMainEvents.MAIN_JSON_MAP_SHOW_DIALOG, (e, message) => {
    showDialogChooseJSONFile(win, message);
  });
  ipcMain.handle(jsonMapMainEvents.MAIN_JSON_MAP_CHOSE_FILE, (e, message) => {
    parseJSONFileChosen(win, message);
  });
  ipcMain.handle(jsonMapMainEvents.MAIN_JSON_MAP_LIST_KEYS, (e, filepath) => {
    findKeysInJsonFile(win, filepath);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  // const menu = Menu.buildFromTemplate(applicationMenu(app).menuTemplate);
  // app.on(applicationMenuEvents.MAIN_MENU_TRANSFORM_XML_TO_JSON, () => {
  //   console.log('app heard it');
  //   win.webContents.send(applicationMenuEvents.MAIN_MENU_TRANSFORM_XML_TO_JSON, {});
  // });
  // Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Window listeners
 * adhd: a hunter and a farmers world
 */
app.on('activate', () => {
  const mainWindow = BrowserWindow.getAllWindows();
  if (mainWindow.length > 0) {
    mainWindow[0].show();
  } else {
    app.quit();
  }
});