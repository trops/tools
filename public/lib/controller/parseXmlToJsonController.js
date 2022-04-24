const { dialog } = require('electron');
const mainApi = require('../api/mainApi');

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
  var saxStream = mainApi.parseXML.createSaxStream(true);

  // console.log(saxParser);
  const tagsFound = [];

  var nodesFound = [];
  var node = {};

  /**
   * Stream events
   */

  saxStream.on('opentag', data => {
    // let's keep adding tags until we have a duplicate.
    // this should have iterated through the root and one child node...
    if (tagsFound.indexOf(data.name) < 0) {
      tagsFound.push(data.name);
      win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODE_FOUND, { 
        message: "Found node", node: data.name });
    }
  });

  saxStream.on('closetag', data => {
    nodesFound.push(node);
  });

  saxStream.on('end', data => {
    // if we have reached the end, destroy the stream
    win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODES_COMPLETE, { 
      message: "We have reached the end of the road", tags: tagsFound 
    });
    fileStream.close();
    fileStream.destroy();
  });

  saxStream.on('error', data => {
    // error, kill it
    win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, { message: "Error Found" } );
    fileStream.close();
    fileStream.destroy();
  })

  fileStream.pipe(saxStream);
}


const parseXMLFileSaxData = (xmlFilePath, nodeToExtract, win) => {
  var fileStream = mainApi.createReadStream(xmlFilePath);
  var saxStream = mainApi.parseXML.createSaxStream(true, { lowercase: true, trim: true });

  var nodesFound = [];
  var node = null;
  var currentTag = null;
  var currentText = '';
  var tagsInNode = [];
  /**
   * Stream events
   */
  saxStream.on('text', data => {
    // console.log('text', data.replace(/(\r\n|\n|\r)/gm, ""));
    // data.replace(/(\r\n|\n|\r)/gm, "");
    //console.log('concat ', currentText.concat(data));
    if (node !== null && currentTag !== null && data !== '') {
      currentText = currentText.concat(data.replace(/(\r\n|\n|\r|\t)/gm, ""));
      node[currentTag] = currentText;
    } 
  });

  saxStream.on('opentag', data => {

    currentTag = data.name;
    currentText = '';
    // we have to check if the node is null, and if the nodeToExtract matches...
    if (data.name && nodeToExtract === data.name && node === null) {
      tagsInNode.push(data.name);
      console.log('NODE MATCH', data);
      node = {};
    } else if (node && data.name) {
      // we have a node, it has not closed yet...
      tagsInNode.push(data.name);

      var nodeBuilding = node;
      tagsInNode.forEach(n => {
        console.log('tags in node', n);  
        if (n in node) {
          console.log('we already have this one');
          if (currentTag === n) {
            if (isObject(node))
            console.log('we have a second one!');
          }
        }
      });
    }
    if (node) {
      if (Object.keys(data.attributes).length > 0) {
        node['attrs'] = data.attributes;
      } 
    }

    currentTag = data.name;
      // node[currentTag] = {};
      // if (Object.keys(data.attributes).length > 0) {
      //   node['attrs'] = data.attributes;
      // } 
    
    // let's keep adding tags until we have a duplicate.
    // this should have iterated through the root and one child node...
    // if (tagsFound.indexOf(data.name) < 0) {
    //   tagsFound.push(data.name);
    //   win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODE_FOUND, { 
    //     message: "Found node", node: data.name });
    //}
  });

  saxStream.on('closetag', data => {
    //console.log('close', data);
    // close this out
    if (data === nodeToExtract) {
      console.log('close this', data);
      node && nodesFound.push(node);
      // reset the node
      node = null;
      currentTag = null;
      currentText = '';
      tagsInNode = [];
    }
  });

  saxStream.on('end', data => {
    console.log(nodesFound);
    // if we have reached the end, destroy the stream
    // win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODES_COMPLETE, { 
    //   message: "We have reached the end of the road", tags: tagsFound 
    // });
    fileStream.close();
    fileStream.destroy();
  });

  saxStream.on('error', data => {
    // error, kill it
    // win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, { message: "Error Found" } );
    fileStream.close();
    fileStream.destroy();
  })

  fileStream.pipe(saxStream);//.pipe(saxParser);
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
    //parseXMLFileSaxData(filepath, nodeToExtract, win);
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
  // reset the counter, this will determine our commas
  count = 0;
  // read, split, and write the file
  readStream.pipe(xmlSplitterStream(nodeToExtract, writeStream, win).stream);
}

const xmlSplitterStream = (nodeToExtract, writeStream, win) => {
  // event listeners for the xmlSplitter
  return mainApi.parseXML.xmlSplitter(`//${nodeToExtract}`)
    .on('data', (node, tag, path) => {
      win.webContents.send(mainApi.renderEvents.RENDER_PARSE_SPLIT_XML_NODE, { node, tag, path });
      node && writeStream.write(parseChunk(node, win));
      count++;
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
    //console.log(chunk);
    //console.log(sanitizeNode(chunk));
    // const sanitized = chunk !== undefined ? sanitizeNode(chunk) : null;
    // here we have to deal with the $t and place that "text" as the actual value of the node key.
    return (count > 0 ? ',\n' : '') + JSON.stringify(chunk).replaceAll('$t', "_value");
  } catch (e) {
    win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_TO_JSON_ERROR, e.message);
  }
}

const parseChunkSanitized = (chunk, win) => {
  try {
    const sanitized = chunk !== undefined ? sanitizeNode(chunk) : null;
    // here we have to deal with the $t and place that "text" as the actual value of the node key.
    return (count > 0 ? ',\n' : '') + JSON.stringify(sanitized);//.replaceAll('$t', "_value");
  } catch (e) {
    win.webContents.send(mainApi.renderEvents.RENDER_PARSE_XML_TO_JSON_ERROR, e.message);
  }
}

const sanitizeNode = (obj, key = null, keysFound = {}) => {
  let keys = keysFound;
  // 1. check all of the keys in the object, and see if the key is '$t'
  // 2. If the key is $t, we will make this the value of the parent key, and then add all of the keys within the value to the parent level as well.
  Object.keys(obj).forEach(k => {
    const v = obj[k];
    if (isObject(v) === true) {
      keys[k] = v;
      sanitizeNode(v, k, keys);
    } else if (Array.isArray(v) === true) {
      console.log("ARRAY");
      // we have to handle the array a little differently...
      keys[k] = v.map(arrayValue => cleanAttributes(arrayValue));
    } else {
      if (k === '$t') {
        keys[key] = v;
      } else {
        if ('attrs' in keys === false) {
          keys['attrs'] = {};
        }
        keys['attrs'][k] = v;
      } 
    }
  });
  return keys;
}

const cleanAttributes = (obj) => {
  console.log(obj);
  let cleanObj = {};
  Object.keys(obj).forEach(k => {
    const v = obj[k];
    console.log(k);
    if (k === '$t') {
      cleanObj[k] = v;
    } else {
      if ('attrs' in cleanObj === false) {
        cleanObj['attrs'] = {};
      }
      cleanObj['attrs'][k] = v;
    } 
  });
  return cleanObj;
}

const isObject = (foo) => foo === Object(foo) && Object.prototype.toString.call(foo) !== '[object Array]';

module.exports = { 
  showDialogChooseXMLFile,
  parseXMLFileChosen,
  parseXMLFileChosenWithNode,
};