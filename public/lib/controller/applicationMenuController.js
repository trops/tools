const { BrowserWindow } = require("electron");
const { applicationMenuEvents } = require('../events');

const applicationMenu = (app) => {
  /**
   * menuTemplate
   * @returns {object} the template for the application menu
   */
  return {
    menuTemplate: [
    {
      label: 'Tool(s)',
      submenu: [
        {
          role: 'About',
        },
        {
          type: 'separator'
        },
        {
          role: 'Quit',
        }
      ]
    },
    {
      label: 'Transform',
      submenu: [
        {
          label: 'XML to JSON',
          click: () => {
            console.log('clicked menu item');
            app.emit(applicationMenuEvents.MAIN_MENU_TRANSFORM_XML_TO_JSON, {});
          }
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('http://github.com/trops/tools') }
        }
      ]
    }
  ],

  getCurrentWindow: () => {
    return BrowserWindow.getFocusedWindow();
  },
  
  openMenu: (x, y) => {
    // mainApi.send(`display-app-menu`, { x, y });
  },
  
  minimizeWindow: (browserWindow = this.getCurrentWindow()) => {
    if (browserWindow.minimizable) {
      browserWindow.minimize();
    }
  },
  maximizeWindow: (browserWindow = this.getCurrentWindow()) => {
    if (browserWindow.maximizable) {
      browserWindow.maximize();
    }
  },
  unmaximizeWindow: (browserWindow = this.getCurrentWindow()) => {
    browserWindow.unmaximize();
  },
  maxUnmaxWindow: (browserWindow = this.getCurrentWindow()) => {
    if (browserWindow.isMaximized()) {
      browserWindow.unmaximize();
    } else {
      browserWindow.maximize();
    }
  },
  closeWindow:(browserWindow = this.getCurrentWindow()) => {
    browserWindow.close();
  },
  isWindowMaximized: (browserWindow = this.getCurrentWindow()) => {
    return browserWindow.isMaximized();
  }
}
}
module.exports = {
  applicationMenu
};