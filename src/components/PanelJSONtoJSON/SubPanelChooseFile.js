import React from "react";
import Button from "../common/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SubPanelChooseFile extends React.Component {
  render() {
    return (
      <div className="flex flex-col w-full h-full space-y-4">
        <div className="flex flex-1 h-full">
          <button type="button" className="relative block w-full border-2 border-gray-400 border-dashed rounded-lg p-12 text-center hover:border-gray-400" onClick={this.props.onClick}>
            <FontAwesomeIcon icon="file-arrow-down" className="h-32 w-32 text-indigo-500 animate-pulse" />
            <span className="mt-2 block text-2xl font-medium text-gray-600">Click to choose file</span>
          </button>
        </div>
      <Button onClick={this.props.onCancel} title="Cancel" size="small" />
    </div>
    )
  }
}

SubPanelChooseFile.defaultProps = {
  onCancel(){},
  onClick(){}
}
export default SubPanelChooseFile;