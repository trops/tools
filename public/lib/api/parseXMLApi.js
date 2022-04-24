/**
 * parseXmlApi
 * Methods that will be used in the ParseXML task of the Tools
 */
const { ipcRenderer } = require('electron');
const sax = require('sax');
const XMLSplitter = require('xml-splitter');
const { parseXmlMainEvents } = require('../events');

const parseXmlApi = {
  showDialogChooseXMLFile: () => ipcRenderer.invoke(parseXmlMainEvents.MAIN_PARSE_XML_SHOW_DIALOG, {}),
  parseXMLFileChosen: (message) => ipcRenderer.invoke(parseXmlMainEvents.MAIN_PARSE_XML_CHOSE_FILE, message),
  parseXMLFileChosenWithNode: (message) => ipcRenderer.invoke(parseXmlMainEvents.MAIN_PARSE_XML_CHOSE_FILE_WITH_NODE, message),
  createSaxStream: () => sax.createStream(),
  saxParser: () => sax.parser(true),
  xmlSplitter: (nodeToExtract) => new XMLSplitter(nodeToExtract)
};

module.exports = parseXmlApi;