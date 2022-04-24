import React from 'react';

class NestedTree extends React.Component {

  handleDragStart = () => {

  }

  handleDragEnd = () => {

  }

  handleHoverItem = () => {

  }

  handleClickItem = () => {

  }

  // renderKeysInspectorRecursive = (keys, jsonData, items = [], count = 0, parentKey = null, isChildArray = false) => {

  //   // lets loop through all of the keys
  //   Object.keys(keys).forEach(key => {

  //     let newParentKey = parentKey !== null 
  //       ? (isChildArray === false ? `${parentKey}.${key}` : `${parentKey}${key}`) 
  //       : key;

  //     try {
  //       // first we have to check to see if the object is a string...
  //       let jsonObjectFromKey = mainApi.jsonMap.getJsonFromObjectWithDot(newParentKey, jsonData);
  //       const isString = typeof jsonObjectFromKey === 'string';
  //       const isArray = Array.isArray(jsonObjectFromKey);
  //       let dotObjectFromKey = mainApi.jsonMap.convertObjectToDotObject(jsonObjectFromKey);
        
  //       // not a string or an array
  //       if (isString === false && isArray === false) {
  //         items.push(
  //           <div 
  //             onMouseOver={() => this.handleMouseOverKey(key, jsonObjectFromKey)}
  //             onClick={() => this.handleClickKey(key, jsonData, newParentKey)}
  //             className="flex flex-row w-full rounded p-2 bg-gray-900 hover:bg-indigo-800 cursor-pointer space-x-2 space-y-2"
  //           >
  //             { parentKey !== null && <span className="text-xl font-bold"><FontAwesomeIcon icon="l" /></span>}
  //             <span className="flex bg-indigo-600 font-bold font-family-mono rounded px-2 py-1 text-sm">{newParentKey}</span>
  //             {/* <span className="font-mono text-xs">{JSON.stringify(jsonObjectFromKey, null, 2)}</span> */}
  //           </div>
  //         );

  //         this.renderKeysInspectorRecursive(dotObjectFromKey, jsonData, items, count++, newParentKey);
  //       } else if (isArray === true) {
  //         try {
  //           // recursive call 
  //           items.push(
  //             <div 
  //               onMouseOver={() => this.handleMouseOverKey(key, jsonObjectFromKey, newParentKey)}
  //               onClick={() => this.handleClickKey(key, jsonData, newParentKey)}
  //               className="flex flex-row w-full rounded p-2 bg-gray-900 hover:bg-indigo-800 cursor-pointer space-y-2"
  //             >
  //               {parentKey !== null && <span className="p-2 text-xs font-bold"><FontAwesomeIcon icon="l" /></span>}
  //               <span className="flex bg-red-600 font-bold font-family-mono rounded px-2 py-1 text-sm">{newParentKey}</span>
  //             </div>
  //           );
  //           // recursive call 
  //           this.renderKeysInspectorRecursive(dotObjectFromKey, jsonData, items, count++, newParentKey, true);
  //         } catch(e) {
  //           console.log('array error: ', e.message);
  //         }
  //       } else {
  //         // element is a String VALUE (end)
  //         items.push(
  //           <div 
  //             onMouseOver={() => this.handleMouseOverKey(key, jsonData, newParentKey)}
  //             onClick={() => this.handleClickKey(key, jsonData, newParentKey)}
  //             className="flex flex-col w-full p-2 rounded bg-gray-900 space-x-2 hover:bg-green-800 cursor-pointer">
  //             <div className="flex flex-row align-top justify-start h-full items-center">
  //               {parentKey !== null && <span className="p-2 text-xs font-bold align-top"><FontAwesomeIcon icon="l" /></span>}
  //               <span className="flex flex-col bg-green-700 font-bold font-family-mono rounded px-2 py-1 text-sm justify-start align-top">{key}</span>
  //             </div>
  //           </div>
  //         );
  //       }
  //     } catch(e) {
  //       console.log(e.message);
  //       // return null;
  //     }
  //   });

  //   return items;
  // }

  render() {
    return (
      <div />
    );
  }
}

NestedTree.defaultProps = {

}

export default NestedTree;