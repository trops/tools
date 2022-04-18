import React from 'react';
import MenuItem from './MenuItem';


class MainMenu extends React.Component {
  
  openFileWindow = () => {
    this.props.onChoose("XML-JSON");
  }

  render() {
    return (
      <div className="flex flex-row w-full space-x-4 h-1/3 p-4">
        <MenuItem disabled={false} onClick={this.openFileWindow} title="XML to JSON" />
        <MenuItem disabled onClick={() => alert("You have chosen poorly.")} title="CSV to JSON" />
        <MenuItem disabled onClick={() => alert("You have chosen poorly.")} title="JSON Map" />
      </div>
    );
  }
}

MainMenu.defaultProps = {
  onChoose(){},
}

export default MainMenu;