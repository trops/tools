import React from "react";
import Button from "../common/Button";

class SubPanelFindNodes extends React.Component {
  render() {
    const { nodeFound } = this.props;
    return (
      <div className="flex flex-col w-full h-full justify-between">
          {nodeFound}
        <Button onClick={this.props.onCancel} title="Cancel" />
        </div>
    );
  }
}

SubPanelFindNodes.defaultProps = {
  sourceFile: '',
  nodeFound: '',
  onClick(){},
  onCancel(){}
}
export default SubPanelFindNodes;