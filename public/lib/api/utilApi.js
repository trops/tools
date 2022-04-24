const utilApi = {
  getType: (oObj) => {
    if(typeof oObj === "object"){
      return ( oObj === null )?'Null':
      // Check if it is an alien object, for example created as {world:'hello'}
      ( typeof oObj.constructor !== "function" )?'Object':
      // else return object name (string)
      oObj.constructor.name;              
    }   

    // Test simple types (not constructed types)
    return ( typeof oObj === "boolean")?'Boolean':
           ( typeof oObj === "number")?'Number':
           ( typeof oObj === "string")?'String':
           ( typeof oObj === "function")?'Function':false;
  }
};

module.exports = utilApi;