const {
  showDialogChooseXMLFile,
  parseXMLFileChosen,
  parseXMLFileChosenWithNode, 
} = require('./parseXmlToJsonController');

const {
  applicationMenu, 
} = require('./applicationMenuController');

const {
  showDialogChooseJSONFile,
  parseJSONFileChosen,
  findKeysInJsonFile
} = require('./jsonMapController');

module.exports = {
  showDialogChooseXMLFile,
  parseXMLFileChosen,
  parseXMLFileChosenWithNode,
  applicationMenu,
  showDialogChooseJSONFile,
  parseJSONFileChosen,
  findKeysInJsonFile
}