import React from 'react';

class MenuItem extends React.Component {

  render() {
    const { disabled, title, onClick } = this.props;
    return disabled === false ? (
      <div
          onClick={onClick}
          className="flex flex-1 bg-gray-100 rounded p-2 text-gray-700 shadow cursor-pointer items-center align-middle text-center hover:bg-green-400 hover:text-gray-100"
        >
          <p className="font-bold w-full text-2xl">{title}</p>
      </div>
    ) : (
      <div
          className="flex flex-1 bg-gray-100 rounded p-2 text-gray-700 shadow cursor-pointer items-center align-middle text-center hover:bg-red-400 hover:text-gray-100"
        >
          <p className="font-bold w-full text-2xl">{title}</p>
      </div>
    );
  }
}

MenuItem.defaultProps = {
  onClick(){},
  title: 'Hello',
  disabled: true,
}

export default MenuItem;