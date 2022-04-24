/**
 * jsonMapApi
 * Methods that will be used in the ParseXML task of the Tools
 */
const { ipcRenderer } = require('electron');
const { jsonMapMainEvents } = require('../events');
const JSONStream = require('JSONStream');
const jsonata = require('jsonata');
const prettyPrintJson = require('pretty-print-json');
// import { prettyPrintJson } from 'pretty-print-json';
const dotObject = require('dot-object');
const jsonMapApi = {
  showDialogChooseJSONFile: () => {
    ipcRenderer.invoke(jsonMapMainEvents.MAIN_JSON_MAP_SHOW_DIALOG, {})
  },
  onChoseFile: (message) => {
    ipcRenderer.invoke(jsonMapMainEvents.MAIN_JSON_MAP_CHOSE_FILE, { message })
  },
  JSONStream: () => JSONStream,
  /**
   * jsonata
   * jsonata query language for json
   * @returns Object
   */
  jsonata: () => jsonata,
  evaluateExpression: (exp, data) => {
    try {
      const expression = jsonata(exp);
      return expression.evaluate(data);
    }catch (e) {
      return e.message;
    }
  },
  prettifyJson:(json, options) => {
    return prettyPrintJson.prettyPrintJson.toHtml(json);
  },
  /**
   * objToDotObject
   * @param {object} the json object
   * @return {object} the dot object
   */
  convertObjectToDotObject:(obj, keepArray = true ) => {
    dotObject.keepArray = keepArray;
    return dotObject.dot(obj);
  },
  convertDotObjectToJsonObject:(obj) => {
    return dotObject.object(obj);
  },
  getJsonFromObjectWithDot: (dot, jsonData) => {
    return dotObject.pick(dot, jsonData);
  },
  /**
   * findKeysInJsonFile
   * This event will trigger the main thread to read the JSON file provided
   * and generate a list of keys for the JSON
   * @param {Object} message { message: filepath<String> }
   */
  findKeysInJsonFile: (filepath) => {
    ipcRenderer.invoke(jsonMapMainEvents.MAIN_JSON_MAP_LIST_KEYS, filepath)
  } 
};

module.exports = jsonMapApi;