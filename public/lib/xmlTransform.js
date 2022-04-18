const xmlParser = require('xml-js');

/**
 * nativeType
 * Maintain the native type of the value
 */
function nativeType(value) {
  var nValue = Number(value);
  if (!isNaN(nValue)) {
    return nValue;
  }
  var bValue = value.toLowerCase();
  if (bValue === 'true') {
    return true;
  } else if (bValue === 'false') {
    return false;
  }
  return value;
}

// // Remove the _text attribute in the translated XML -> JSON
var removeJsonTextAttribute = function(value, parentElement) {
  try {
    
    var keyNo = Object.keys(parentElement._parent).length;
    var keyName = Object.keys(parentElement._parent)[keyNo - 1];

    // remove the _attributes and _text and make it more readable.
    if (parentElement._parent[keyName]['_attributes'] !== undefined) {
      const obj = {};
      Object.keys(parentElement._parent[keyName]['_attributes']).forEach(k => {
        obj[k] = parentElement._parent[keyName]['_attributes'][k];
      });
      obj['value'] = nativeType(value);
      parentElement._parent[keyName] = obj;
    } else {
      parentElement._parent[keyName] = nativeType(value);
    }
  } catch (e) {}
}

// Options for the XML Translation
var options = {
  compact: true,
  trim: true,
  ignoreDeclaration: true,
  ignoreInstruction: true,
  ignoreAttributes: false,
  ignoreComment: true,
  ignoreCdata: true,
  ignoreDoctype: true,
  //textFn: removeJsonTextAttribute,
};

/**
 * transformer
 * The transformer function to translate the XML to JSON
 * @param {string} xmlText the xml string
 * @returns {string} json result
 */
function transformer(xmlText) {
    xmlText = xmlText.toString().replace("\ufeff", "");
    const parsed = xmlParser.xml2js(xmlText, options);
    return parsed;
}

function transformerPromise(xmlText) {
    return Promise.resolve(transformer(xmlText));
}

module.exports = {
    transformer: transformer,
    transformerPromise: transformerPromise
};