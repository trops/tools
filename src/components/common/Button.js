import React from "react";

class Button extends React.Component {
  render() {
    const { color } = this.props;
    return (
      <div 
        className={`flex rounded-sm text-center ${color} p-2 w-full items-center flex-row align-middle justify-center cursor-pointer`}
        onClick={this.props.onClick}
      >
        <span className="block text-sm font-medium text-gray-200">{this.props.title}</span>
      </div>
    )
  }
}

Button.defaultProps = {
  onClick(){},
  title: '',
  size: 'medium',
  color: 'bg-gray-600'
}

export default Button;