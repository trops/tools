import React from "react";

class Footer extends React.Component {

  render() {
    const { chosen, onCancel } = this.props;
    return (
      <div className="flex flex-row p-4 bg-gray-800 w-full justify-center mt-auto text-xs text-center items-center">
        {/* {chosen !== null && (<div className="bg-gray-600 text-white p-2 text-xs rounded-sm cursor-pointer" onClick={onCancel}>Home</div>)} */}
        <span className="text-gray-600">@trops</span>

      </div>
    )
  }
}

Footer.defaultProps = {
  chosen: null,
  onCancel(){}
}

export default Footer;