import React from "react";
import Button from "../common/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SubPanelChooseFile extends React.Component {
  render() {
    return (
      <div className="flex flex-col w-full h-full space-y-4">
        <div className="flex flex-1 h-full">
          <button type="button" className="relative block w-full border-2 border-gray-400 border-dashed rounded-lg p-12 text-center hover:border-gray-400" onClick={this.props.onClick}>
            {/* <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6" />
            </svg> */}
            {/* <FontAwesomeIcon icon="file" className="h-32 w-32 text-gray-200" /> */}
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