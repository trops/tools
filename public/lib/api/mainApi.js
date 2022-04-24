const { ipcRenderer, shell } = require('electron');
const fs = require('fs');
const { 
  parseXmlRenderEvents, 
  parseXmlMainEvents, 
  jsonMapMainEvents,
  jsonMapRenderEvents,
  applicationMenuEvents 
} = require('../events');
const parseXmlApi = require('./parseXMLApi');
const applicationMenuApi = require('./applicationMenuApi');
const jsonMapApi = require('./jsonMapApi');
const utilApi = require('./utilApi');
/**
 * Api to expose the ipcRenderer invoke message sending capabilities
 * ipcMain will then handle the invocation from this main api, which is called
 * inside the renderer and exposed from the contextBridge
 */

//  const objTypes = {
//   'get': function(prop) {
//      return Object.prototype.toString.call(prop);
//   },
//   'null': '[object Null]',
//   'object': '[object Object]',
//   'array': '[object Array]',
//   'string': '[object String]',
//   'boolean': '[object Boolean]',
//   'number': '[object Number]',
//   'date': '[object Date]',
// }

const mainApi = {
    mainEvents: { 
      ...parseXmlMainEvents, 
      ...jsonMapMainEvents
    },
    renderEvents: { 
      ...parseXmlRenderEvents, 
      ...jsonMapRenderEvents 
    },
    applicationMenuEvents: { ...applicationMenuEvents },

    removeListener: (name, fn) => ipcRenderer.removeListener(name, fn),
    removeAllListeners: () => ipcRenderer.removeAllListeners(),
    addListener: (name, fn) => ipcRenderer.addListener(name, fn),

    createReadStream: (filepath) => {
      console.log('create read stream: ', filepath);
      return fs.createReadStream(filepath)
    },
    createWriteStream: (filepath) => fs.createWriteStream(filepath),
    
    on: (event, fn) => ipcRenderer.on(event, fn),
    openFolder: (fileLocation) => {
      shell.showItemInFolder(fileLocation) // Show the given file in a file manager. If possible, select the file.
      shell.openPath('folderpath') // Open the given file in the desktop's default manner.
    },
    parseXML: parseXmlApi,
    applicationMenu: applicationMenuApi,
    jsonMap: jsonMapApi,
    util: utilApi
};

module.exports = mainApi;