import React from 'react';
import PanelXMLToJSON from './PanelXMLtoJSON/PanelXMLtoJSON.js';

class TopAction extends React.Component {
  render() {
    const { chosen, onCancel } = this.props;
    return (
      <div className="flex flex-col bg-indigo-600 text-gray-100 w-full align-middle items-center flex-1 text-center overflow-hidden">
        { chosen === null && (
          <div className="flex flex-col my-auto space-y-2 p-4 h-full w-full justify-center align-middle">
            <h1 className="flex flex-col p-5 text-5xl font-bold rounded-lg">Welcome Human</h1>
            <h1 className="flex flex-col text-2xl">Please choose wisely.</h1>
          </div>
        )}
        {chosen === 'XML-JSON' && <PanelXMLToJSON onCancel={onCancel} onStepChange={this.handleStepChange} />}
      </div>
    );
  }
}

TopAction.defaultProps = {
  chosen: null,
  onCancel(){}
}

export default TopAction;