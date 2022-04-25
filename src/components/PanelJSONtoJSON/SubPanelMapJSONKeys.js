import React from "react";
import { Button } from "../common";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
  BreadcrumbJSON,
  NestedTreeItem
 } from "./components";
import { labelColorForType, bgColorForType } from "./util";

const mainApi = window.mainApi;

class SubPanelMapJSONKeys extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: null,
      selectedJsonData: {},
      selectedDotNotation: null,
      selectedDotKeys: [],
      reorderedNodes: []
    }
  }

  generateTerminalMessages = (nodes) => {
    return nodes.length > 0 ? nodes.map(node => {
      return {
        text: "Found node: " + node,
        showCursor: false,
        showPrompt: false,
      }
    }) : [];
  }

  displayDotNotation = (dotData, jsonData) => {
    // const { jsonMap } = mainApi;
    return Object.keys(dotData).map(dotKey => {
      // const result = jsonMap.evaluateExpression(`['bucket-definitions'].['attribute-bucket'][0].display-name._value`, jsonData);
      // const result = jsonMap.evaluateExpression(dotKey, jsonData);
      return (
        <div key={`main-${dotKey}`} className="flex flex-col w-full rounded text-sm font-medium text-gray-100 bg-gray-700 p-2">
          {this.displayDotNotationDepth(dotKey, jsonData)}
        </div>
      );
    })
  }

  displayDotNotationDepth = (dotKey, jsonData) => {

    const { jsonMap } = mainApi;
    
    return dotKey.split('.').map((key, index) => {
      const marginFromIndex = 'ml-0';
      const result = jsonMap.evaluateExpression(dotKey, jsonData);
      // console.log(expression.evaluate(jsonData));
      // {expression.evaluate(jsonData)}
      return (
        <div 
          onClick={() => this.handleClickTag(dotKey)}
          key={`depth-${index}`} 
          className={`flex flex-1 w-full rounded text-gray-100 bg-gray-700 p-2 cursor-pointer hover:bg-indigo-600 text-xs ${marginFromIndex}`}>
          {key}:{result}
        </div>
      );
    });
  }

  renderKeysInspector = (dotKey = null, jsonData, parentKey = null, isChildArray = false) => {
    const jsonDataForDot = dotKey !== null ? mainApi.jsonMap.getJsonFromObjectWithDot(dotKey, jsonData) : jsonData;
    
    const objectType = mainApi.util.getType(jsonDataForDot);
    
    const items = [];

    const finalDot = dotKey !== null ? 
      (dotKey.indexOf('.') > 0 
        ? dotKey.split('.').at(-1)
        : dotKey) : null;

    items.push(
      <div 
        className="flex flex-row w-full rounded p-2 bg-gray-900 hover:bg-indigo-800 cursor-pointer space-x-2 space-y-2"
      >
        <span className="flex bg-indigo-600 font-bold font-family-mono rounded px-2 py-1 text-sm">{finalDot}</span>
      </div>
    );

    if(objectType === false) {
      return;
    }

    if (objectType.toLowerCase() === 'string') {

      items.push(
        <NestedTreeItem 
            //onMouseOver={() => this.handleMouseOverKey(key, jsonObjectFromKey, newParentKey)}
            //onClick={() => this.handleClickKey(key, jsonData, newParentKey)}
            parentKey={parentKey}
            newParentKey={finalDot}
            jsonData={jsonDataForDot}
            currentKey={finalDot}
            
          />
      )
    }

    if (objectType.toLowerCase() === 'array') { 
        const indexKey = jsonDataForDot[0];

        Object.keys(indexKey).forEach(key => {

          let newParentKey = parentKey !== null 
          ? (isChildArray === false ? `${parentKey}.${key}` : `${parentKey}${key}`) 
          : key;


          items.push(
            <NestedTreeItem 
                //onMouseOver={() => this.handleMouseOverKey(key, jsonObjectFromKey, newParentKey)}
                //onClick={() => this.handleClickKey(key, jsonData, newParentKey)}
                parentKey={parentKey}
                newParentKey={key}
                jsonData={jsonDataForDot[indexKey]}
                currentKey={key}
                
              />
          )
        });
    }

    if (objectType.toLowerCase() === 'object') {
      Object.keys(jsonDataForDot).forEach(key => {

        let newParentKey = parentKey !== null 
          ? (isChildArray === false ? `${parentKey}.${key}` : `${parentKey}${key}`) 
          : key;

        items.push(
          <NestedTreeItem 
              //onMouseOver={() => this.handleMouseOverKey(key, jsonObjectFromKey, newParentKey)}
              //onClick={() => this.handleClickKey(key, jsonData, newParentKey)}
              parentKey={parentKey}
              newParentKey={key}
              jsonData={jsonDataForDot}
              currentKey={key}
              
            />
        )
      });
    }

    return items;
  }


  isSelectedDotKey = (dotKey, selectedDotKeys) => {
    // console.log('CHECKING SELECTED ', dotKey, selectedDotKeys);
    return dotKey === null ? true : (selectedDotKeys.filter(d => d.startsWith(dotKey)).length > 0);
  };

  /**
   * selectedDotKeyIndex
   * There may be instances of the same name so we have to filter the array using startsWith
   * @param {*} dotKey 
   * @param {*} selectedDotKeys 
   * @returns 
   */
  selectedDotKeyIndex = (dotKey, selectedDotKeys) => {
    // console.log('selected dot key matches: ', dotKey, selectedDotKeys);
    return selectedDotKeys.filter(d => {
      return d.startsWith(dotKey);
    });
  }

  isChildOfDotKey = (key, dotKey) => {
    // console.log('child check ', key, dotKey, dotKey.split('.').filter(d => d === key));
    
    const dotKeyArray = dotKey.split('.');
    // console.log('child check dot key array: ', dotKeyArray);
    const dotKeyRootNodes = dotKeyArray.filter(d => d === key);
    // console.log('child check root nodes', dotKeyRootNodes);
    return dotKey !== null 
      ? dotKey
        .split('.')
        .filter(d => d === key)
        .length > 0 
      : false;
  }
  

  /**
   * generateKeysInspectorRecursive
   * This is the MAIN function that generates the nodes in the tree structure UI
   * If we see an Array type, we have to treat this differently...
   * @param {*} keys 
   * @param {*} jsonData 
   * @param {*} items 
   * @param {*} count 
   * @param {*} parentKey 
   * @param {*} isChildArray 
   * @param {*} dragProvider 
   * @param {*} indexCount 
   * @returns 
   */
  generateKeysInspectorRecursive = (keys, jsonData, items = [], count = 0, parentKey = null, isChildArray = false, dragProvider, indexCount = 0) => {
    const { selectedDotKeys } = this.state;

    // get the json object based on the parent so we can check the type
    let jsonObjectFromParentKey = parentKey !== null ? mainApi.jsonMap.getJsonFromObjectWithDot(parentKey, jsonData) : null;

    // check the type of the parent json
    const sourceParentDataType = mainApi.util.getType(jsonObjectFromParentKey);
    console.log('KEYS:----------------- ', keys, parentKey, sourceParentDataType);

    if (sourceParentDataType === 'Array') {
      jsonData = jsonData[0];
    }

    // lets loop through all of the keys
    Object.keys(keys).forEach((key, index) => {
      console.log('Key: -----------', key);

      // bump the count for unique indices
      indexCount++;

     

      // depending on the parent type and value we have to manipulate the parentKey to "skip" each item in the index
      // and just let the user see the structure
      let newParentKey = parentKey !== null 
        ? (sourceParentDataType === 'Array' ? `${parentKey}[0].${key}` : `${parentKey}.${key}`) 
        : key;
      
      console.log('new parent ', newParentKey, sourceParentDataType);

      // lets check to see which nodes to SHOW in the list based on the selected items in the state array
      const isSelected = this.isSelectedDotKey(parentKey, selectedDotKeys);
      
        try {
          // first we have to check to see if the object is a string...
          let jsonObjectFromKey = mainApi.jsonMap.getJsonFromObjectWithDot(newParentKey, jsonData);

          // let's see what type of data we have been given...
          // if this is Array data, we have to reach into the array 
          // and get one of the elements if this exists.
          const sourceDataType = mainApi.util.getType(jsonObjectFromKey);

          // let's get the dotObject from the source JSON passed to the function
          // if Array, let's use the first element of the array.
          let dotObjectFromKey = sourceDataType === 'Array' 
            ? mainApi.jsonMap.convertObjectToDotObject(jsonObjectFromKey[0]) || {}
            : mainApi.jsonMap.convertObjectToDotObject(jsonObjectFromKey);

          // console.log('dot object from key: ', dotObjectFromKey);

          let jsonFromDotObject = mainApi.jsonMap.convertDotObjectToJsonObject(dotObjectFromKey);

          // Let's use the main json object for the current node 
          // to determine if this data structure is a specific type
          const objectType = mainApi.util.getType(jsonObjectFromKey);
          const isString = objectType === 'String';
          const isArray = objectType === 'Array';

          console.log('object type for new parent key', objectType, jsonObjectFromKey);

          // items.push({
          //   index: indexCount,
          //   id: `${indexCount}`,
          //   count: count,
          //   parentKey: parentKey,
          //   newParentKey: newParentKey,
          //   jsonData: jsonFromDotObject,
          //   currentKey: key,
          //   objectType: objectType
          // });
          // // Recurse
          // isSelected && this.generateKeysInspectorRecursive(dotObjectFromKey, jsonData, items, count++, newParentKey, isChildArray, dragProvider, indexCount);

          
          // not a string or an array
          if (isString === false && isArray === false) {
            items.push({
              index: indexCount,
              id: `${indexCount}`,
              count: count,
              parentKey: parentKey,
              newParentKey: newParentKey,
              jsonData: jsonFromDotObject,
              currentKey: key,
              objectType: objectType
            });
            // Recurse
            isSelected && this.generateKeysInspectorRecursive(dotObjectFromKey, jsonData, items, count++, newParentKey, isChildArray, dragProvider, indexCount);
          } else if (isArray === true) {
            try {
              items.push({
                  index: indexCount,
                  id: `${indexCount}`,
                  count: count,
                  parentKey: `${parentKey}`,
                  newParentKey: `${newParentKey}`,
                  jsonData: jsonFromDotObject,
                  currentKey: key,
                  objectType: objectType
              });

              // recursive call 
              isSelected && this.generateKeysInspectorRecursive(dotObjectFromKey, jsonData, items, count++, newParentKey, true, dragProvider, indexCount);

            } catch(e) {
              console.log('array error: ', e.message);
            }
          } else {
            // element is a String VALUE (end)
            if(isSelected === true) { 
              items.push({
                index: indexCount,
                id: `${indexCount}`,
                count: count,
                parentKey: parentKey,
                newParentKey: newParentKey,
                jsonData: jsonFromDotObject,
                currentKey: key,
                objectType: objectType
              });
            }

            //isSelected && this.generateKeysInspectorRecursive(dotObjectFromKey, jsonData, items, count++, newParentKey, isChildArray, dragProvider, indexCount);
          }
        } catch(e) {
          console.log(e.message);
        }
    //  }
    });

    return items;
  }

  /**
   * renderNodesToDisplay
   * Switched to this function so we can pass in the array of nodes
   * and use that array in the draggable portion of the feature
   * @param {*} nodes 
   * @param {*} jsonData 
   * @param {*} dragProvider 
   * @returns 
   */
  renderNodesToDisplay = (nodes, jsonData, dragProvider = null, dragPrefix = null) => {
    
    const filtered = nodes.filter(n => {
      return this.isSelectedDotKey(n.parentKey, this.state.selectedDotKeys) === true;
    });

    // console.log('NODES TO SHOW IN THE TREE: ', filtered);
    const items = filtered.length > 0 
      ? filtered
        .map(node => {
        if (node !== undefined) {
          const { currentKey, jsonObjectFromKey, newParentKey } = node;
          return (
            <NestedTreeItem 
              dragPrefix={dragPrefix}
              key={newParentKey}
              myProp={new Date()}
              {...node}
              dragProvider={dragProvider}
              onMouseOver={() => this.handleMouseOverKey(currentKey, jsonObjectFromKey, newParentKey)}
              onClick={() => this.handleClickKey(currentKey, jsonObjectFromKey, newParentKey)}
            />
          );
        } else {
          return null;
        }
      }).filter(n => n !== null) : null;

      return items;
  }

  renderTransformedNodesToDisplay = (nodes, jsonData, dragProvider = null, dragPrefix = null) => {
    
    // const filtered = nodes.filter(n => {
    //   return this.isSelectedDotKey(n.parentKey, this.state.selectedDotKeys) === true;
    // });

    // console.log('NODES TO SHOW IN THE TREE: ', filtered);
    const items = nodes.length > 0 
      ? nodes
        .map(node => {
        if (node !== undefined) {
          const { currentKey, jsonObjectFromKey, newParentKey } = node;
          return (
            <NestedTreeItem 
              // dragPrefix={dragPrefix}
              key={`transformed-${newParentKey}`}
              {...node}
              dragProvider={dragProvider}
              //onMouseOver={() => this.handleMouseOverKey(currentKey, jsonObjectFromKey, newParentKey)}
              //onClick={() => this.handleClickKey(currentKey, jsonObjectFromKey, newParentKey)}
            />
          );
        } else {
          return null;
        }
      }).filter(n => n !== null) : null;

      return items;
  }

  renderKeysInspectorDetail = (key, dotKey, jsonData) => {
    const jsonDataForDot = mainApi.jsonMap.getJsonFromObjectWithDot(dotKey, jsonData);
    // now lets determine what type of object this is...
    const objectType = mainApi.util.getType(jsonDataForDot);
    const labelColor = labelColorForType(objectType);
    const bgColor = bgColorForType(objectType);
    return jsonDataForDot && (
      <div className="flex flex-col w-full h-full rounded space-y-2">
        <div className={`flex flex-row w-full ${labelColor} text-gray-100 rounded-lg p-4 text-xl font-bold justify-between`}>
          <span className="">{key}</span>
          <span className="">{objectType}</span>
        </div>
        <div className={`flex flex-row w-full ${labelColor} text-gray-100 rounded-lg p-2 text-xs font-bold justify-between word-wrap`}>
          <span className="">{dotKey}</span>
        </div>
        <div className={`flex flex-row w-full h-full ${bgColor} text-gray-200 rounded-lg p-4 text-xs overflow-y-scroll scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-800`}>
          <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(jsonDataForDot, null, 2)}</pre>
        </div>
      </div>
    );
  }

  handleMouseOverKey = (key, jsonData, dotKey) => {
    // const jsonDataForDot = mainApi.jsonMap.getJsonFromObjectWithDot(dotKey, jsonData);
    // this.setState({
    //   selectedKey: dotKey,
    //   selectedJsonData: jsonDataForDot,
    // });
  }

  handleClickKey = (key, jsonData, dotKey) => {
    console.log('-------------CLICKED -------------');
    console.log('clicked ', key, dotKey, jsonData);
    const dotKeyIndex = this.selectedDotKeyIndex(dotKey, this.state.selectedDotKeys);
    console.log('selected dot key index ', dotKeyIndex);
    const jsonDataForDot = mainApi.jsonMap.getJsonFromObjectWithDot(dotKey, jsonData);
    // based on if the key is selected, we should add or remove it.
    const { selectedDotKeys } = this.state;
    let newSelectedKeys = [...selectedDotKeys];
    if (dotKeyIndex.length > 0) {
      // we have to remove ALL of the selected dotKeys that contain this partial...
      
      console.log('need to remove everything that starts wtih ', dotKey, newSelectedKeys);
      // selectedDotKeys.splice(dotKeyIndex, 1);
      newSelectedKeys = newSelectedKeys.filter(d => {
        console.log('checking for removal ', d, dotKey);
        return d.startsWith(dotKey) === false;
      });

    } else {
      console.log('adding to index ', dotKey);
      newSelectedKeys.push(dotKey);
    }

    console.log('selected dot keys ', dotKey, newSelectedKeys);
    this.setState({
      update: new Date(),
      selectedKey: key,
      selectedDotKey: dotKey,
      selectedJsonData: jsonDataForDot,
      selectedDotKeys: newSelectedKeys,
    }, () => {
      this.forceUpdate();
    });
  }

  handleClickTag = (tag) => {
    console.log(tag);
  }

  handleClickBreadcrumb = (key, dotKey) => {
    if (key !== null) {
      const { jsonData } = this.props;
      const jsonDataForDot = mainApi.jsonMap.getJsonFromObjectWithDot(dotKey, jsonData);
      const dotKeyIndex = this.selectedDotKeyIndex(dotKey, this.state.selectedDotKeys);
      // based on if the key is selected, we should add or remove it.
      const { selectedDotKeys } = this.state;
      if (dotKeyIndex > -1) {
        selectedDotKeys.splice(dotKeyIndex, 1);
      } else {
        selectedDotKeys.push(dotKey);
      }
      this.setState({
        selectedKey: key,
        selectedDotKey: dotKey,
        selectedJsonData: jsonDataForDot,
        selectedDotKeys
      });
    } else {
      this.setState({
        selectedKey: null,
        selectedDotKey: null,
        selectedJsonData: {},
        selectedDotKeys: []
      });
    }
  }

  handleOnDragEnd = (result, nodesToDisplay) => {
    console.log('dragged source:', result.source);
    console.log('dragged destination: ', result.destination);
    console.log('dragged draggableId: ', result.draggableId);
    console.log('drag reason ', result.reason);
    console.log('drag nodes to display ', nodesToDisplay);

    if (!result.destination || result.draggableId === null) {
      return;
    }
    
    const dotKey = result.draggableId.split('-').at(-1);
    console.log('drag', dotKey);
    const jsonForNode = nodesToDisplay.filter(node => node.currentKey === dotKey);
    console.log('JSON FROM drag ', jsonForNode);
    //console.log('destination index: ', result.destination.index, result.source.index, result.draggableId, dotKey);
    // console.log('source: ', result.source);

    // we need to get the actual array index of the elements and make some changes here!
    // the index being stored in the drag is NOT ACCURATE 
    // and we should use the keys to find the item in the array....
    // const items = Array.from(characters);
    // const [reorderedItem] = nodesToDisplay.splice(result.source.index - 1, 1);

    // const [reorderedItem] = nodesToDisplay.filter(node => node.index = result.source.index);
    // const [destinationItem] = nodesToDisplay.filter(node => node.index = result.destination.index);
    // console.log('reordered item : ', reorderedItem);
    // nodesToDisplay.splice(destinationItem, 0, reorderedItem);


    // console.log(reorderedItem, nodesToDisplay);
    // console.log('drag ', nodesToDisplay);
    const newReordered = this.state.reorderedNodes.concat(jsonForNode);
    
    this.setState({
      reorderedNodes: newReordered,
    }, () => {
      console.log('REORDERED');
    });
  }

  render() {
    const { jsonData } = this.props;
    const { selectedKey, selectedJsonData, selectedDotKey, reorderedNodes } = this.state;
    const crumbs = selectedDotKey ? selectedDotKey.split('.') : [];
    const nodesToDisplay = this.generateKeysInspectorRecursive(jsonData, jsonData, [], 0, null, false);
    console.log('REORDERED ', reorderedNodes);
    return (
      <div className="flex flex-col w-full h-full space-y-4">
        <div className="flex flex-row space-x-4 h-full w-full">
          <div className="flex flex-col h-full w-full space-y-2">
            <BreadcrumbJSON crumbs={crumbs} onClick={this.handleClickBreadcrumb} />
            <DragDropContext onDragEnd={(result) => this.handleOnDragEnd(result, nodesToDisplay)}> 
            <div className="flex flex-row h-full w-full overflow-hidden space-x-2">
            

              {/* source file */}
              <div className="flex flex-col space-y-1 h-full justify-start text-left align-left items-start w-full bg-gray-900 rounded overflow-hidden">
                <div className="flex flex-row w-full border-b-2 border-indigo-900 p-2 rounded-tr rounded-tl bg-gray-900">
                  <span className="text-xs font-bold text-gray-400">SOURCE</span>
                </div>
                <div className="flex flex-col w-full h-full overflow-y-scroll scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-800 p-2 bg-clip-border space-y-1">
                      <Droppable droppableId="json-list">
                        {provided => (
                          <div {...provided.droppableProps} ref={provided.innerRef} key="droppable-inner-div">
                              {nodesToDisplay !== null && this.renderNodesToDisplay(nodesToDisplay, jsonData, provided, 'source')}
                              {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1 h-full justify-start text-left align-left items-start w-full bg-gray-900 p-2 rounded overflow-hidden">
                {jsonData && selectedDotKey && this.renderKeysInspectorDetail(selectedKey, selectedDotKey, jsonData)}
              </div>

              {/* transformed list */}
              <div className="flex flex-col space-y-1 h-full justify-start text-left align-left items-start w-full bg-gray-900 rounded overflow-hidden">
                <div className="flex flex-row w-full border-b-2 border-indigo-900 p-2 rounded-tr rounded-tl bg-gray-900">
                  <span className="text-xs font-bold text-gray-400">TRANSFORMED</span>
                </div>
                <div className="flex flex-col w-full h-full overflow-y-scroll scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-800 p-2 bg-clip-border space-y-1">
                  
                    <Droppable droppableId="json-list-transformed">
                        {(provided, snapshot) => {
                          console.log('SNAPSHOT ', snapshot);
                          console.log('provided ', provided);
                          const bgColor = snapshot.isDraggingOver ? 'bg-indigo-900' : '';
                          return (
                            <div {...provided.droppableProps} ref={provided.innerRef} key="droppable-inner-div-transformed" className={`flex flex-col h-full w-full rounded ${bgColor}`}>
                                {this.renderTransformedNodesToDisplay(reorderedNodes, jsonData, provided, 'transformed')}
                                {provided.placeholder}
                            </div>
                          )
                        }}
                      </Droppable>
                  
                </div>
              </div>

              

              {/* node details or transform file */}
              {/* <div className="flex flex-col space-y-1 h-full justify-start text-left align-left items-start w-full bg-gray-900 rounded border-2 border-gray-900 overflow-hidden">
                <div className="flex w-full bg-gray-900 border-b-2 border-gray-800 p-2 rounded-tr rounded-tl">
                  <span className="text-xs font-bold text-gray-400">Node Inspector</span>
                </div>
                <div className="flex flex-col bg-gray-800 w-full h-full overflow-y-scroll scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-800">
                  {jsonData && this.renderKeysInspector(selectedDotKey, jsonData, selectedDotKey, false)}
                </div>
              </div> */}

              {/* <div className="flex flex-col space-y-1 h-full justify-start text-left align-left items-start w-full bg-gray-900 p-2 rounded overflow-hidden">
                {jsonData && selectedDotKey && this.renderKeysInspectorDetail(selectedKey, selectedDotKey, jsonData)}
              </div> */}
              
            </div>
            </DragDropContext>
          </div>
        </div>
      <Button onClick={this.props.onCancel} title="Cancel" size="small" />
    </div>
    )
  }
}

SubPanelMapJSONKeys.defaultProps = {
  onCancel(){},
  onClick(){},
  jsonData: null,
  dotData: null,
  keysArray: null
}
export default SubPanelMapJSONKeys;
