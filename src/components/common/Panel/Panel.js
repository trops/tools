import React from 'react';
import ErrorBanner from '../Banner/ErrorBanner';

class Panel extends React.Component {

  
  render() {
    const { errorMessage } = this.props;
    return (
      <div className="flex flex-1 flex-col h-full bg-gray-800 text-gray-100 rounded-lg align-middle items-center text-center p-4 border-t-1 border-gray-800 space-y-4 overflow-hidden">
          {errorMessage && <ErrorBanner message={errorMessage} />}
          {this.props.children}
      </div>
    );
  }
}

Panel.defaultProps = {
  children: [],
  errorMessage: null
}

export default Panel;