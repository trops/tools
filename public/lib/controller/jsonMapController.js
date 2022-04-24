const { dialog } = require('electron');
const mainApi = require('../api/mainApi');

let count = 0;
let keysFound = [];

/**
 * showDialogChooseJSONFile
 */
const showDialogChooseJSONFile = (win, message) => {
  
  // open the dialog to choose the file
  dialog.showOpenDialog({ properties: ['openFile'] })
    .then(result => {
      const filepath = result.filePaths[0];
      const extension = filepath.substr(filepath.lastIndexOf('.') + 1);
      if (extension === 'json') {
        count = 0;
        const toFilepath = filepath.substring(0, filepath.length - 4) + '_mapped.json';
        if (filepath) {
          win.webContents.send(mainApi.renderEvents.RENDER_MAP_JSON_CHOSE_FILE, { filepath, toFilepath });
        } else {
          win.webContents.send(mainApi.renderEvents.RENDER_MAP_JSON_CHOSE_FILE_ERROR, { 
            message: "Could not open file" 
          });
        }
      } else {
        console.log('NOT XML');
        win.webContents.send(mainApi.renderEvents.RENDER_MAP_JSON_CHOSE_FILE_ERROR, { 
          message: "Please choose an JSON file." 
        });
      }
    }).catch(e => console.log(e));
}

/**
 * parseJSONFileChosen
 * Read the JSON file selected and determine the keys
 */
const parseJSONFileChosen = (win, message) => {
  const { filepath, toFilepath } = message;
  if (filepath && toFilepath) {
    win.webContents.send(mainApi.renderEvents.RENDER_MAP_JSON_CHOSE_FILE, { 
      filepath, toFilepath
    });
  } else {
    win.webContents.send(mainApi.renderEvents.RENDER_MAP_JSON_CHOSE_FILE_ERROR, { 
      message: "There was an error parsing the nodes." 
    });
  }
}

/**
 * findKeysInJsonFile
 * Find all of the keys in the JSON file selected
 * @param { BrowserWindow } win the main window
 * @param { String } filepath the path to the JSON file
 * @return { jsonData, keysArray, dotData }
 * - jsonData is the actual data from one "chunk"
 * - dotData is the dot notation for the json data
 * - keysArray is the array of all of the keys in the json chunk
 */
const findKeysInJsonFile = (win, filepath) => {
  const readStream = mainApi.createReadStream(filepath);
  const jsonStream = mainApi.jsonMap.JSONStream();
  let keysArray = [];
  let jsonData = {};
  readStream
    .pipe(
      jsonStream.parse('*')
        .on('data', (d) => {
          if (keysArray.length < 1) {
            keysArray.push(findAllKeysInObject(d));
            jsonData = d;
          }
          // win.webContents.send(mainApi.renderEvents.RENDER_MAP_JSON_FOUND_KEY, d);
        })
        .on('end', () => {
          // can we use jsonata here to do something fun? 
          const dotData = mainApi.jsonMap.convertObjectToDotObject(jsonData, false);
          win.webContents.send(
            mainApi.renderEvents.RENDER_MAP_JSON_FOUND_KEYS, { 
              keysArray, 
              jsonData,
              dotData
            });
        })
    );
}

const findAllKeysInObject = (obj, key = null, keysFound = {}) => {
  let keys = keysFound;
  Object.keys(obj).forEach(k => {
    const v = obj[k];
    if (typeof v !== 'object') {
      if (key !== null && key in keys !== false) {
        keys[key].push(k);
      } else {
        keys[key] = [];
        keys[key].push(k);
      }
    } else if (typeof v === 'object') {
      findAllKeysInObject(v, k, keys);
    }
  });
  return keys;
}

// const parseXMLFileSaxTags = (xmlFilePath, win) => {
//   var fileStream = mainApi.createReadStream(xmlFilePath);
//   var saxParser = mainApi.parseXML.createSaxStream(true);
//   const tagsFound = [];

//   saxParser.on('opentag', data => {
//     // let's keep adding tags until we have a duplicate.
//     // this should have iterated through the root and one child node...
//     if (tagsFound.indexOf(data.name) < 0) {
//       tagsFound.push(data.name);
//       win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODE_FOUND, { 
//         message: "Found node", node: data.name });
//     }
//   });

//   saxParser.on('end', data => {
//     // if we have reached the end, destroy the stream
//     win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODES_COMPLETE, { 
//       message: "We have reached the end of the road", tags: tagsFound 
//     });
//     fileStream.close();
//     fileStream.destroy();
//   });

//   saxParser.on('error', data => {
//     // error, kill it
//     win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, { message: "Error Found" } );
//     fileStream.close();
//     fileStream.destroy();
//   })

//   fileStream.pipe(saxParser);
// }

/**
 * parseXMLFileChosenWithNode
 * Parse the xml file based on a chosen node
 * @param {*} xmlFilePath 
 * @param {*} win 
 */
// const parseXMLFileChosenWithNode = (win, message) => {
//   const { filepath, toFilepath, nodeToExtract } = message;
//   if (filepath && toFilepath && nodeToExtract) {
//     parseXMLFile(filepath, toFilepath, nodeToExtract, win);
//   } else {
//     win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, { 
//       message: "Hmm, it appears your paths are incorrect" 
//     });
//   }
// };

/**
 * parseXMLFile
 * Parse the filepath to the XML
 * - first we have to split the file into workable chunks
 * - experiment...
 * @param {string} xmlFilePath the filepath to the XML
 */
// const parseXMLFile = (xmlFilePath, jsonFilepath, nodeToExtract, win) => {

//   // input readable stream with event handlers
//   const readStream = mainApi.createReadStream(xmlFilePath);
//   const writeStream = mainApi.createWriteStream(jsonFilepath);

//   // begin the JSON file  
//   writeStream.write('[');

//   // read, split, and write the file
//   readStream.pipe(xmlSplitterStream(nodeToExtract, writeStream, win).stream);
// }

// const xmlSplitterStream = (nodeToExtract, writeStream, win) => {
//   // event listeners for the xmlSplitter
//   return mainApi.parseXML.xmlSplitter(`//${nodeToExtract}`)
//     .on('data', (node, tag, path) => {
//       win.webContents.send(mainApi.renderEvents.RENDER_PARSE_SPLIT_XML_NODE, { node, tag, path });
//       node && writeStream.write(parseChunk(node, win));
//     }).on("end", () => {
//       writeStream.write(']');
//       writeStream.end();
//       win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_TO_JSON_COMPLETE,'');
//     })
//     .on("error", (error) => {
//       win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_TO_JSON_ERROR, error.message);
//       writeStream.end();
//     });
// }

/**
 * parseChunk
 * Replace the strange $t characters and stringify the JSON
 * @param {object} chunk the JSON conversion that was extracted with XMLSplitter
 * @param {BrowserWindow} win the BrowserWindow object
 * @returns String the JSON string
 */
// const parseChunk = (chunk, win) => {
//   try {
//     return (count > 0 ? ',\n' : '') + JSON.stringify(chunk).replaceAll('$t', "_value");
//   } catch (e) {
//     win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_TO_JSON_ERROR, e.message);
//   }
// }

module.exports = { 
  showDialogChooseJSONFile,
  // parseJSONFileChosen,
  findKeysInJsonFile
};