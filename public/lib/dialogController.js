const { dialog } = require('electron');
const fs = require('fs');
const sax = require('sax');
const XMLSplitter = require('xml-splitter');

let count = 0;
/**
 * showDialogChooseXMLFile
 * @param {*} win 
 * @param {*} message 
 */
const showDialogChooseXMLFile = (win, message) => {
  
  dialog.showOpenDialog({ properties: ['openFile'] })
    .then(result => {
      const filepath = result.filePaths[0];
      const extension = filepath.substr(filepath.lastIndexOf('.') + 1);
      if (extension === 'xml') {
        count = 0;
        const toFilepath = filepath.substring(0, filepath.length - 4) + '.json';
        if (filepath) {
          win.webContents.send('choseXMLFile', { filepath, toFilepath });
        } else {
          win.webContents.send('parseXMLFileChosenError', { 
            message: "Could not open file" 
          });
        }
      } else {
        win.webContents.send('parseXMLFileChosenError', { 
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
    win.webContents.send('parseXMLFileChosenError', { 
      message: "There was an error parsing the nodes." 
    });
  }
}

const parseXMLFileSaxTags = (xmlFilePath, win) => {
  var fileStream = fs.createReadStream(xmlFilePath);
  var saxParser = sax.createStream(true);
  const tagsFound = [];
  saxParser.on('opentag', data => {
    // let's keep adding tags until we have a duplicate.
    // this should have iterated through the root and one child node...
    if (tagsFound.indexOf(data.name) < 0) {
      tagsFound.push(data.name);
      win.webContents.send('parseXMLFileChosenTagFound', { 
        message: "Found node", node: data.name });
    }
  });

  saxParser.on('end', data => {
    // if we have reached the end, destroy the stream
    win.webContents.send('parseXMLFileChosenTagsFound', { 
      message: "We have reached the end of the road", tags: tagsFound 
    });
    fileStream.close();
    fileStream.destroy();
  });

  saxParser.on('error', data => {
    // error, kill it
    win.webContents.send('parseXMLFileChosenError', { message: "Error Found" } );
    fileStream.close();
    fileStream.destroy();
  })

  fileStream
    .pipe(saxParser);
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
    win.webContents.send('parseXMLFileChosenError', { 
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
  const readStream = fs.createReadStream(xmlFilePath);
  const writeStream = fs.createWriteStream(jsonFilepath);

  // begin the JSON file  
  writeStream.write('[\n');

  // read, split, and write the file
  readStream.pipe(xmlSplitterStream(nodeToExtract, writeStream, win).stream);
}

const xmlSplitterStream = (nodeToExtract, writeStream, win) => {
  // event listeners for the xmlSplitter
  return new XMLSplitter(`//${nodeToExtract}`)
    .on('data', (node, tag, path) => {
      win.webContents.send('xmlDataParsed', 'got xml data');
      writeStream.write(parseChunk(node));
    }).on("end", () => {
      writeStream.write('\n]');
      writeStream.end();
      win.webContents.send('xmlToJsonComplete','');
    })
    .on("error", (error) => {
      win.webContents.send('xmlToJsonError', error.message);
      writeStream.end();
    });
}

const parseChunk = (chunk) => {
  return (count > 0 ? ',\n' : '') + JSON.stringify(chunk).replaceAll('$t', "_value");
}

module.exports = { 
  showDialogChooseXMLFile,
  parseXMLFileChosen,
  parseXMLFileChosenWithNode,
};