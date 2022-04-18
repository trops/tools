import React from "react";

class Container extends React.Component {
  render() {
    return (
      <div className='flex flex-1 flex-col w-full h-auto p-4 space-y-4 overflow-hidden'>{this.props.children}</div>
    );
  }
}

export default Container;