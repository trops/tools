import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { labelColorForType } from '../util';

const mainApi = window.mainApi;

class NestedTreeItem extends React.Component {

  handleClickKey = (key, jsonData, newParentKey) => {
    this.props.onClick(key, jsonData, newParentKey);
  }

  handleMouseOverKey = (key, jsonData, newParentKey) => {
    this.props.onMouseOver(key, jsonData, newParentKey);
  }

  marginForDepth = (depth) => {
    let marginLeft = 'ml-0';
    if (depth > 0) marginLeft = 'ml-2';
    if (depth > 1) marginLeft = 'ml-4';
    if (depth > 2) marginLeft = 'ml-6';
    if (depth > 3) marginLeft = 'ml-8';
    return marginLeft;
  }

  render() {
    const { currentKey, parentKey, jsonData, jsonObjectFromKey, newParentKey } = this.props;
    const depth = newParentKey !== null ? (newParentKey.indexOf('.') > -1 ? newParentKey.split('.').length : 1) : 1;
    const depthMargin = this.marginForDepth(depth);
    const objectType = mainApi.util.getType(jsonData);
    const labelBgColor = labelColorForType(objectType);
    return (
      <div 
        onMouseOver={() => this.handleMouseOverKey(currentKey, jsonObjectFromKey)}
        onClick={() => this.handleClickKey(currentKey, jsonData, newParentKey)}
        className="flex flex-row w-full rounded p-2 hover:bg-gray-800 cursor-pointer space-x-2 justify-between"
      >
        { parentKey !== null && (
          <span className={`text-xl font-bold text-gray-400 ${depthMargin} items-start`}>
            <FontAwesomeIcon icon="l" />
          </span>
        )}
        <div className="flex flex-row justify-between w-full items-center">
          <span className={`flex ${labelBgColor} font-bold font-family-mono rounded px-2 py-1 text-xs`}>{newParentKey}</span>
          <span className="flex bg-gray-700 font-medium font-family-mono rounded px-2 py-1 text-xs">{objectType}</span>
        </div>
      </div>
    )
  }
}

NestedTreeItem.defaultProps = {
  currentKey: null,
  jsonData: {},
  parentKey: null,
  newParentKey: null,
  onClick(){},
  onMouseOver(){},
  onDragEnter(){},
  onDragend(){},
  onDragGoOver(){}
}

export default NestedTreeItem;