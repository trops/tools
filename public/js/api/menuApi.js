/**
 * menuApi
 * Methods that will be used to handle the tasks of the Header menu
 */
 const { ipcRenderer } = require('electron');
 const { menuEvents } = require('../events');
 
 const menuApi = {
   closeWindow: () => ipcRenderer.invoke(menuEvents.MENU_CLOSE_WINDOW, {}),
   minimizeWindow: () => ipcRenderer.invoke(menuEvents.MENU_MINIMIZE_WINDOW, {}),
   maximizeWindow: () => ipcRenderer.invoke(menuEvents.MENU_MAXIMIZE_WINDOW, {})
 };
 
 module.exports = menuApi;