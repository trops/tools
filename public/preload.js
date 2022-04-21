/**
 * preload.js
 * 
 */
  const { contextBridge } = require('electron');
  const mainApi = require('./lib/api');

  // expose the methods to the renderer
  contextBridge.exposeInMainWorld( 'mainApi', mainApi );
