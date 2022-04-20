/**
 * preload.js
 * 
 */
  const { contextBridge } = require('electron');
  const mainApi = require('./api/mainApi');

  // expose the methods to the renderer
  contextBridge.exposeInMainWorld( 'mainApi', mainApi );
