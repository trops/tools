/**
 * menuApi
 * Methods that will be used to handle the tasks of the Header menu
 * @environment MAIN
 */
 //const { BrowserWindow } = require('electron');
 //const { applicationMenuEvents } = require('../events');
 
 const menuApi = {
  //  closeWindow: (e, args) => {
  //    const win = BrowserWindow.getFocusedWindow();
  //    win && win.webContents.send(applicationMenuEvents.MAIN_MENU_CLOSE_WINDOW, {});
  //  },
  //  minimizeWindow: () => {
  //   const win = BrowserWindow.getFocusedWindow();
  //   win.webContents.send(applicationMenuEvents.MAIN_MENU_CLOSE_WINDOW, {});
  //  },
  //  maximizeWindow: () => {
  //   const win = BrowserWindow.getFocusedWindow();
  //   win.webContents.send(applicationMenuEvents.MAIN_MENU_CLOSE_WINDOW, {});
  //  },
   transformXmlToJson: () => {
    console.log();
   }
 };
 
 module.exports = menuApi;