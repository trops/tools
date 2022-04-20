const { dialog } = require('electron');
const mainApi = require('../js/api/mainApi');

let count = 0;
/**
 * showDialogChooseXMLFile
 * @param {*} win 
 * @param {*} message 
 */
const showDialogChooseXMLFile = (win, message) => {
  
  // open the dialog to choose the file
  dialog.showOpenDialog({ properties: ['openFile'] })
    .then(result => {
      const filepath = result.filePaths[0];
      const extension = filepath.substr(filepath.lastIndexOf('.') + 1);
      if (extension === 'xml') {
        count = 0;
        const toFilepath = filepath.substring(0, filepath.length - 4) + '.json';
        if (filepath) {
          win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE, { filepath, toFilepath });
        } else {
          win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, { 
            message: "Could not open file" 
          });
        }
      } else {
        win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, { 
          message: "Please choose an XML file." 
        });
      }
    }).catch(e => console.log(e));
}

/**
 * parseXMLFileChosen
 * Parse the file initially and find the nodes for the user to choose
 */
const parseXMLFileChosen = (win, message) => {
  const { filepath, toFilepath } = message;
  if (filepath && toFilepath) {
    parseXMLFileSaxTags(filepath, win);
  } else {
    win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, { 
      message: "There was an error parsing the nodes." 
    });
  }
}

const parseXMLFileSaxTags = (xmlFilePath, win) => {
  var fileStream = mainApi.createReadStream(xmlFilePath);
  var saxParser = mainApi.parseXML.createSaxStream(true);
  const tagsFound = [];

  saxParser.on('opentag', data => {
    // let's keep adding tags until we have a duplicate.
    // this should have iterated through the root and one child node...
    if (tagsFound.indexOf(data.name) < 0) {
      tagsFound.push(data.name);
      win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODE_FOUND, { 
        message: "Found node", node: data.name });
    }
  });

  saxParser.on('end', data => {
    // if we have reached the end, destroy the stream
    win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODES_COMPLETE, { 
      message: "We have reached the end of the road", tags: tagsFound 
    });
    fileStream.close();
    fileStream.destroy();
  });

  saxParser.on('error', data => {
    // error, kill it
    win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, { message: "Error Found" } );
    fileStream.close();
    fileStream.destroy();
  })

  fileStream.pipe(saxParser);
}

/**
 * parseXMLFileChosenWithNode
 * Parse the xml file based on a chosen node
 * @param {*} xmlFilePath 
 * @param {*} win 
 */
const parseXMLFileChosenWithNode = (win, message) => {
  const { filepath, toFilepath, nodeToExtract } = message;
  if (filepath && toFilepath && nodeToExtract) {
    parseXMLFile(filepath, toFilepath, nodeToExtract, win);
  } else {
    win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, { 
      message: "Hmm, it appears your paths are incorrect" 
    });
  }
};

/**
 * parseXMLFile
 * Parse the filepath to the XML
 * - first we have to split the file into workable chunks
 * - experiment...
 * @param {string} xmlFilePath the filepath to the XML
 */
const parseXMLFile = (xmlFilePath, jsonFilepath, nodeToExtract, win) => {

  // input readable stream with event handlers
  const readStream = mainApi.createReadStream(xmlFilePath);
  const writeStream = mainApi.createWriteStream(jsonFilepath);

  // begin the JSON file  
  writeStream.write('[');

  // read, split, and write the file
  readStream.pipe(xmlSplitterStream(nodeToExtract, writeStream, win).stream);
}

const xmlSplitterStream = (nodeToExtract, writeStream, win) => {
  // event listeners for the xmlSplitter
  return mainApi.parseXML.xmlSplitter(`//${nodeToExtract}`)
    .on('data', (node, tag, path) => {
      win.webContents.send(mainApi.renderEvents.RENDER_PARSE_SPLIT_XML_NODE, { node, tag, path });
      writeStream.write(parseChunk(node, win));
    }).on("end", () => {
      writeStream.write(']');
      writeStream.end();
      win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_TO_JSON_COMPLETE,'');
    })
    .on("error", (error) => {
      win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_TO_JSON_ERROR, error.message);
      writeStream.end();
    });
}

/**
 * parseChunk
 * Replace the strange $t characters and stringify the JSON
 * @param {object} chunk the JSON conversion that was extracted with XMLSplitter
 * @param {BrowserWindow} win the BrowserWindow object
 * @returns String the JSON string
 */
const parseChunk = (chunk, win) => {
  try {
    return (count > 0 ? ',\n' : '') + JSON.stringify(chunk).replaceAll('$t', "_value");
  } catch (e) {
    win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_TO_JSON_ERROR, e.message);
  }
}

module.exports = { 
  showDialogChooseXMLFile,
  parseXMLFileChosen,
  parseXMLFileChosenWithNode,
};