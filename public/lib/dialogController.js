const { dialog } = require('electron');
const fs = require('fs');
const xtreamer = require('xtreamer');
const { transformer } = require('./xmlTransform');
const sax = require('sax');

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
        const toFilepath = filepath.substring(0, filepath.length - 4) + '.json';
        if (filepath) {
          count = 0;
          win.webContents.send('choseXMLFile', { filepath, toFilepath });
        } else {
          alert('Could not open file');
        }
      } else {
        win.webContents.send('parseXMLFileChosenError', { message: "Please choose an XML file." } );
      }
    }).catch(e => console.log(e));
}


const parseXMLFileChosen = (win, message) => {
  const { filepath, toFilepath } = message;
  if (filepath && toFilepath) {
    parseXMLFileSaxTags(filepath, win);
  } else {
    win.webContents.send('parseXMLFileChosenError', { message: "There was an error parsing the nodes." } );
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
      win.webContents.send('parseXMLFileChosenTagFound', { message: "Found node", node: data.name } );
    }
  });

  saxParser.on('end', data => {
    // if we have reached the end, destroy the stream
    
    win.webContents.send('parseXMLFileChosenTagsFound', { message: "We have reached the end of the road", tags: tagsFound } );
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
 * 
 * @param {*} xmlFilePath 
 * @param {*} win 
 */

const parseXMLFileChosenWithNode = (win, message) => {
  const { filepath, toFilepath, nodeToExtract } = message;
  if (filepath && toFilepath && nodeToExtract) {
    parseXMLFile(filepath, toFilepath, nodeToExtract, win);
  } else {
    win.webContents.send('parseXMLFileChosenError', { message: "Hmm, it appears your paths are incorrect" } );
  }
};

/**
 * parseXMLFile
 * Parse the filepath to the XML
 * @param {string} xmlFilePath the filepath to the XML
 */
const parseXMLFile = (xmlFilePath, jsonFilepath, nodeToExtract, win) => {

  // input readable stream with event handlers
  const readStream = fs.createReadStream(xmlFilePath);
  const writeStream = fs.createWriteStream(jsonFilepath);
  
  writeStream.write('[\n');
  // input | transform
  readStream.pipe(xmlStreamer(nodeToExtract, { transformer: transformer, max_xml_size: 100000000 }, writeStream, win))
}

/**
 * xmlStreamer
 * The streamer to pass into the pipe in order to extract the correct XML
 * @param {string} node the XML node to extract from the file
 * @returns 
 */
const xmlStreamer = (node, jsonTransformer, jsonWriter, win) => {
  return xtreamer(node, jsonTransformer)
    .on("data", (data) => {
      win.webContents.send('xmlDataParsed', 'got xml data');
      jsonWriter.write(parseChunk(data));
      count++;
    })
    .on("end", () => {
      jsonWriter.write('\n]');
      win.webContents.send('xmlToJsonComplete','');
    })
    .on("error", (error) => {
      win.webContents.send('xmlToJsonError', error.message);
    });
}

const parseChunk = (chunk) => {
  return (count > 0 ? ',\n' : '') + chunk.toString();
}

module.exports = { 
  showDialogChooseXMLFile,
  parseXMLFileChosen,
  parseXMLFileChosenWithNode,
};