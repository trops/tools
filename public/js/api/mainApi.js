const { ipcRenderer, shell } = require('electron');
const fs = require('fs');
const { parseXmlRenderEvents, parseXmlMainEvents } = require('../events');
const { parseXmlApi, menuApi } = require('../api');
/**
 * Api to expose the ipcRenderer invoke message sending capabilities
 * ipcMain will then handle the invocation from this main api, which is called
 * inside the renderer and exposed from the contextBridge
 */

const mainApi = {
    mainEvents: { ...parseXmlMainEvents },
    renderEvents: { ...parseXmlRenderEvents },
    
    removeListener: (name, fn) => ipcRenderer.removeListener(name, fn),
    removeAllListeners: () => ipcRenderer.removeAllListeners(),
    addListener: (name, fn) => ipcRenderer.addListener(name, fn),
    createReadStream: (filepath) => fs.createReadStream(filepath),
    createWriteStream: (filepath) => fs.createWriteStream(filepath),
    
    on: (event, fn) => ipcRenderer.on(event, fn),
    openFolder: (fileLocation) => {
      shell.showItemInFolder(fileLocation) // Show the given file in a file manager. If possible, select the file.
      shell.openPath('folderpath') // Open the given file in the desktop's default manner.
    },
    parseXML: parseXmlApi,
    menu: menuApi
};

module.exports = mainApi;