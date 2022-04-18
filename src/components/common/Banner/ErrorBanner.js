import React from "react";

class ErrorBanner extends React.Component {
  render() {
    const { message } = this.props;
    return (
      <div className="flex w-full text-sm p-2 rounded bg-yellow-700 text-white">{message}</div>
    );
  }
}

ErrorBanner.defaultProps = {
  message: 'There was an error processing your request',
}

export default ErrorBanner;