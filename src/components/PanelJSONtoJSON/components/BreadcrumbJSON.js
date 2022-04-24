import React from "react";

class BreadcrumbJSON extends React.Component {

  handleCrumbClick = (key, dotNotation) => {
    this.props.onClick(key, dotNotation);
  }

  labelColorForType = (type) => {
    try {
      let color = 'bg-gray-800';
      if (type === 'String') color = 'bg-green-700';
      if (type === 'Object') color = 'bg-indigo-700';
      if (type === 'Array') color = 'bg-yellow-700';
      return color;
    } catch(e) {
      return 'bg-gray-800';
    }
  }

  renderCrumbs = (crumbs) => {
    let currPath = [];
    return crumbs.map((crumb, index) => {
      // lets add on the crumb to create a clickable dot notation 
      // and also determine the last one...
      currPath.push(crumb);
      const pathString = currPath.join(['.']);

      return index < (crumbs.length - 1) ? (
        <span 
          key={`breadcrumb-node-${index}`}
          onClick={() => this.handleCrumbClick(crumb, pathString)}
          className="flex bg-gray-800 text-gray-100 px-2 py-1 text-xs rounded hover:bg-gray-700 cursor-pointer">
            {crumb}
        </span>
      ) : (
        <span 
          key={`breadcrumb-node-${index}`}
          className="flex text-gray-100 px-2 py-1 text-xs rounded font-bold">
            {crumb}
        </span>
      )
    })
  }

  render() {
    const { crumbs } = this.props;
    return (
      <div className="flex flex-row space-x-2 p-2 rounded bg-gray-900 w-full">
        <span 
          onClick={() => this.handleCrumbClick(null, null)}
          className="flex bg-gray-800 text-gray-100 px-2 py-1 text-xs rounded hover:bg-gray-700 cursor-pointer">
            Root
        </span>
        {this.renderCrumbs(crumbs)}
      </div>
    );
  }
}

BreadcrumbJSON.defaultProps = {
  crumbs: [],
  onClick(){}
}

export default BreadcrumbJSON;