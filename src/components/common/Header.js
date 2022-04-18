import React from "react";

class Header extends React.Component {

  render() {
    const { chosen } = this.props;
    return (
      <div className="flex flex-row p-4 bg-gray-800 w-full justify-start text-gray-100 text-xs space-x-2">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <div onClick={this.props.onCancel} className="cursor-pointer">
                  <svg className="flex-shrink-0 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="sr-only">Home</span>
              </div>
            </li>

            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <div className="ml-2 text-xs font-bold text-gray-200">{chosen}</div>
              </div>
            </li>
          </ol>
        </nav>

      </div>
    )
  }
}

Header.defaultProps = {
  chosen: null,
  onCancel(){}
}

export default Header;