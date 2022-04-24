import React from 'react';
import MenuItem from './MenuItem';


class MainMenu extends React.Component {
  
  openFileWindow = (chosen) => {
    chosen && this.props.onChoose(chosen);
  }

  render() {
    return (
      <div className="flex flex-row w-full space-x-4 h-1/3 p-4">
        <MenuItem disabled={false} onClick={() => this.openFileWindow('XML-JSON')} title="XML to JSON" />
        <MenuItem disabled onClick={() => alert("You have chosen poorly.")} title="CSV to JSON" />
        <MenuItem disabled={false} onClick={() => this.openFileWindow('JSON-JSON')} title="JSON Map" />
      </div>
    );
  }
}

MainMenu.defaultProps = {
  onChoose(){},
}

export default MainMenu;