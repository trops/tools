import React from "react";
class Footer extends React.Component {

  render() {
    return (
      <div className="flex flex-row p-4 bg-gray-800 w-full justify-center mt-auto text-xs text-center items-center">
        <span className="text-gray-600">@trops - v{process.env.REACT_APP_VERSION}</span>
      </div>
    )
  }
}

export default Footer;