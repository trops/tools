const {
  showDialogChooseXMLFile,
  parseXMLFileChosen,
  parseXMLFileChosenWithNode, 
} = require('./parseXmlToJsonController');

const {
  applicationMenu, 
} = require('./applicationMenuController');

module.exports = {
  showDialogChooseXMLFile,
  parseXMLFileChosen,
  parseXMLFileChosenWithNode,
  applicationMenu,
}