import React from "react";
import Button from "../common/Button";
import Terminal from "../common/Panel/Terminal";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const messages = [
  {
    text: 'Hi there',
  }
];

class SubPanelChooseNode extends React.Component {

  handleChooseNode = node => {
    const { complete, onChooseNode } = this.props;
    if (complete) {
      onChooseNode(node);
    } else {
      console.log('not finished');
    }
  }

  handleCancel = () => {
    this.props.onCancel();
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

  render() { 
    const { nodes, nodeFound, complete } = this.props;
    const messages = this.generateTerminalMessages(nodeFound);
    if (complete === true) {
      messages.push({
        text: 'Removing duplicate nodes.',
        showCursor: false,
        showPrompt: false,
      });
      messages.push({
        text: `${[...new Set(nodeFound)].length} nodes found.`,
        showCursor: false,
        showPrompt: false,
        color: 'text-yellow-500'
      });
      messages.push({
        text: `List Complete, please select a node from the right.`,
        showCursor: false,
        showPrompt: false,
        color: 'text-yellow-500'
      });
      messages.push({
        text: '',
        showCursor: true,
        showPrompt: true
      });
    } else {
      messages.push({
        text: 'Parsing...',
        showCursor: false,
        showPrompt: false,
        animated: true,
        color: 'text-yellow-700'
      });
    }

    return (
        <div className="flex w-full flex-col flex-1 rounded space-y-2 h-full">

          <div className="flex flex-1 space-x-4 w-full h-full overflow-hidden">
            <div className="flex flex-col justify-start w-1/2 h-full">
              <Terminal messages={messages} />
            </div>
            <div className="flex flex-col space-y-1 h-full w-1/2 overflow-y-scroll scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-800">
              {nodes.length > 0 && [...new Set(nodeFound)].map(node => {
                return (
                  <div key={node} className="flex space-x-2 w-full rounded text-sm font-medium text-gray-100 bg-gray-700 p-4 cursor-pointer hover:bg-indigo-600 items-center align-middle" onClick={() => this.handleChooseNode(node)}>
                    <FontAwesomeIcon icon="fa-brands fa-hashnode" size="xs" className="text-gray-500 hover:text-gray-100" /><span className="">{node}</span></div>
                )
              })}
              {complete === false && (
                <div className="flex flex-col font-bold text-2xl justify-center items-center text-gray-200 h-full w-full rounded bg-indigo-900 border-2 border-indigo-800">
                  <div className="bg-indigo-700 rounded-lg p-4 animate-pulse">{nodeFound.length} nodes found</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full">
            <Button onClick={this.handleCancel} title="Cancel" />
          </div>

        </div>
    );
  }
}

SubPanelChooseNode.defaultProps = {
  nodes: [],
  nodeFound: '',
  complete: false,
  onChooseNode(){},
  onCancel(){},
}

export default SubPanelChooseNode;