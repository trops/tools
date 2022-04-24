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
      reorderedNodes: null
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
    const { jsonMap } = mainApi;
    return Object.keys(dotData).map(dotKey => {
      // const result = jsonMap.evaluateExpression(`['bucket-definitions'].['attribute-bucket'][0].display-name._value`, jsonData);
      const result = jsonMap.evaluateExpression(dotKey, jsonData);
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


  isSelectedDotKey = (dotKey, selectedDotKeys) => selectedDotKeys.indexOf(dotKey) > -1;

  selectedDotKeyIndex = (dotKey, selectedDotKeys) => selectedDotKeys.indexOf(dotKey);

  generateKeysInspectorRecursive = (keys, jsonData, items = [], count = 0, parentKey = null, isChildArray = false, dragProvider, indexCount = 0) => {

    const { selectedDotKeys } = this.state;

    // lets loop through all of the keys
    Object.keys(keys).forEach((key, index) => {

      indexCount++;
      // console.log('index count ', indexCount);

      let newParentKey = parentKey !== null 
        ? (isChildArray === false ? `${parentKey}.${key}` : `${parentKey}${key}`) 
        : key;

      const isSelected = this.isSelectedDotKey(newParentKey, selectedDotKeys);

      try {
        // first we have to check to see if the object is a string...
        let jsonObjectFromKey = mainApi.jsonMap.getJsonFromObjectWithDot(newParentKey, jsonData);
        let dotObjectFromKey = mainApi.jsonMap.convertObjectToDotObject(jsonObjectFromKey);
        const objectType = mainApi.util.getType(jsonObjectFromKey);
        const isString = objectType === 'String';
        const isArray = objectType === 'Array';

        // not a string or an array
        if (isString === false && isArray === false) {
         
          items.push({
            index: indexCount,
            id: `${indexCount}`,
            count: count,
            parentKey: parentKey,
            newParentKey: newParentKey,
            jsonData: jsonObjectFromKey,
            currentKey: key,
            key: key
          });

          isSelected && this.generateKeysInspectorRecursive(dotObjectFromKey, jsonData, items, count++, newParentKey, isChildArray, dragProvider, indexCount);

        } else if (isArray === true) {
          try {

            items.push({
                index: indexCount,
                id: `${indexCount}`,
                count: count,
                parentKey: parentKey,
                newParentKey: newParentKey,
                jsonData: jsonObjectFromKey,
                currentKey: key,
                key: key
            });

            // recursive call 
            isSelected && this.generateKeysInspectorRecursive(dotObjectFromKey, jsonData, items, count++, newParentKey, true, dragProvider, indexCount);

          } catch(e) {
            console.log('array error: ', e.message);
          }
        } else {
          // element is a String VALUE (end)
          items.push({
              index: indexCount,
              id: `${indexCount}`,
              count: count,
              parentKey: parentKey,
              newParentKey: key,
              jsonData: jsonObjectFromKey,
              currentKey: key,
              key: key
          });

          isSelected && this.generateKeysInspectorRecursive(dotObjectFromKey, jsonData, items, count++, newParentKey, isChildArray, dragProvider, indexCount);
        }
      } catch(e) {
        console.log(e.message);
      }
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
  renderNodesToDisplay = (nodes, jsonData, dragProvider = null) => {
    return nodes.length > 0 
      ? nodes.map(node => {
        if (node !== undefined) {
          // console.log('NODE: ', node);
          const { key, jsonObjectFromKey, newParentKey } = node;
          return (
            <NestedTreeItem 
              {...node}
              dragProvider={dragProvider}
              onMouseOver={() => this.handleMouseOverKey(key, jsonObjectFromKey, newParentKey)}
              onClick={() => this.handleClickKey(key, jsonData, newParentKey)}
            />
          );
        } else {
          return null;
        }
      }).filter(n => n !== null) : null;
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
    // console.log(key, dotKey);
    const dotKeyIndex = this.selectedDotKeyIndex(dotKey, this.state.selectedDotKeys);
    const jsonDataForDot = mainApi.jsonMap.getJsonFromObjectWithDot(dotKey, jsonData);
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
    if (!result.destination || result.draggableId === null) {
      return;
    }
    
    const dotKey = result.draggableId.split('-').at(-1);
    console.log('destination index: ', result.destination.index, result.source.index, result.draggableId, dotKey);
    console.log('source: ', result.source);

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

    // this.setState({
    //   reorderedNodes: nodesToDisplay
    // });
  }

  render() {
    const { jsonData } = this.props;
    const { selectedKey, selectedJsonData, selectedDotKey, reorderedNodes } = this.state;
    const crumbs = selectedDotKey ? selectedDotKey.split('.') : [];
    const nodesToDisplay = this.generateKeysInspectorRecursive(jsonData, jsonData, [], 0, null, false);
    return (
      <div className="flex flex-col w-full h-full space-y-4">
        <div className="flex flex-row space-x-4 h-full w-full">
          <div className="flex flex-col h-full w-full space-y-2">
            <BreadcrumbJSON crumbs={crumbs} onClick={this.handleClickBreadcrumb} />
            <div className="flex flex-row h-full w-full overflow-hidden space-x-2">

              {/* source file */}
              <div className="flex flex-col space-y-1 h-full justify-start text-left align-left items-start w-full bg-gray-900 rounded overflow-hidden">
                <div className="flex flex-row w-full border-b-2 border-indigo-900 p-2 rounded-tr rounded-tl bg-gray-900">
                  <span className="text-xs font-bold text-gray-400">SOURCE</span>
                </div>
                <div className="flex flex-col w-full h-full overflow-y-scroll scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-800 p-2 bg-clip-border space-y-1">
                  {jsonData && reorderedNodes && (
                    <DragDropContext onDragEnd={(result) => this.handleOnDragEnd(result, reorderedNodes)}>
                      <Droppable droppableId="json-list">
                        {provided => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                              {/* {this.renderKeysInspectorRecursive(jsonData, jsonData, [], 0, null, false, provided)} */}
                              {reorderedNodes === null && nodesToDisplay !== null && this.renderNodesToDisplay(nodesToDisplay, jsonData, provided)}
                              {reorderedNodes !== null && this.renderNodesToDisplay(reorderedNodes, jsonData, provided)}
                              {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                  {jsonData && reorderedNodes === null && (
                    <DragDropContext onDragEnd={(result) => this.handleOnDragEnd(result, nodesToDisplay)}>
                      <Droppable droppableId="json-list">
                        {provided => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                              {/* {this.renderKeysInspectorRecursive(jsonData, jsonData, [], 0, null, false, provided)} */}
                              {reorderedNodes === null && nodesToDisplay !== null && this.renderNodesToDisplay(nodesToDisplay, jsonData, provided)}
                              {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-1 h-full justify-start text-left align-left items-start w-full bg-gray-900 rounded overflow-hidden">
                <div className="flex flex-row w-full border-b-2 border-indigo-900 p-2 rounded-tr rounded-tl bg-gray-900">
                  <span className="text-xs font-bold text-gray-400">TRANSFORMED</span>
                </div>
                <div className="flex flex-col w-full h-full overflow-y-scroll scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-800 p-2 bg-clip-border space-y-1">
                  {jsonData && reorderedNodes && this.renderNodesToDisplay(reorderedNodes, jsonData, null)}
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

              <div className="flex flex-col space-y-1 h-full justify-start text-left align-left items-start w-full bg-gray-900 p-2 rounded overflow-hidden">
                {jsonData && selectedDotKey && this.renderKeysInspectorDetail(selectedKey, selectedDotKey, jsonData)}
              </div>
              
            </div>
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