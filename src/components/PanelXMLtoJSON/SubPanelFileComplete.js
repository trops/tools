import React from "react";
import Button from "../common/Button";
import Terminal from "../common/Panel/Terminal";

const mainApi = window.mainApi;

class SubPanelFileComplete extends React.Component {

  handleOpenFolder = () => {
    const { fileLocation } = this.props;
    mainApi.openFolder(fileLocation);
  }

  render() {
    const { fileLocation } = this.props;
    const messages = [
      {
        text: 'Thank you for feeding me XML.',
        showPrompt: false,
        showCursor: false,
      },
      {
        text: 'Your JSON file is here: ' + fileLocation,
        showPrompt: false,
        showCursor: false,
        color: 'text-yellow-500'
      },
      {
        text: '',
        showPrompt: true,
        showCursor: true,
      }
    ]
    return (
      <div className="flex flex-col w-full h-full items-center space-y-2">
        <div className="flex flex-col h-full w-full justify-center">
          <Terminal messages={messages} />
        </div>
        <div className="flex flex-row space-x-2 w-full">
          <Button onClick={this.props.onCancel} title="Convert Another File" size="small" />
          <Button onClick={this.handleOpenFolder} title="Show file in folder" size="small" color="bg-yellow-700" />
        </div>
    </div>
    )
  }
}

SubPanelFileComplete.defaultProps = {
  fileLocation: '',
  onCancel(){},
  onClick(){}
}
export default SubPanelFileComplete;