import React from "react";

class Terminal extends React.Component {

  /**
   * renderMessage
   * @param {Object} message { message:String, color:String, showPrompt:Boolean }
   */
  renderMessage = (message, prompt, index) => {
    const { 
      showCursor = true, 
      showPrompt = true,
      text, 
      color: textColor = this.props.textColor,
      animated: isAnimated = this.props.animated,
    } = message;

    const trueTextColor = showPrompt === true ? 'text-indigo-200' : textColor;
    const animatedClass = isAnimated === true ? 'animate-pulse' : '';
    return (
      <span key={`message-${index}`} className={`flex w-full text-xs font-mono font-medium break-all items-start pb-1 ${trueTextColor} ${animatedClass}`}>{`${showPrompt === true ? `${prompt} ` : ''}${text}`}
        {showCursor === true && (<span className="animate-pulse bg-indigo-400 h-full w-2 ml-2 opacity-90">&nbsp;</span>)}
      </span>
    );
  }

  render() {
    const { heading, messages, onCancel, prompt } = this.props;
    return (
      <div className="flex flex-col h-full w-full rounded bg-gray-900 text-indigo-200 text-sm border-2 border-gray-700 overflow-hidden">
        <div className="flex flex-col bg-gray-800 border-b-2 border-gray-700 shadow justify-center items-center">
          <span className="text-gray-500 p-2 justify-center items-center font-mono text-xs shadow">{heading}</span>
        </div>
        {/* <div className="flex w-full h-full"> */}
          <div className="flex flex-1 flex-col-reverse p-4 w-full overflow-y-scroll h-full scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-800">
            {messages.reverse().map((message, index) => this.renderMessage(message, prompt, index))}
          </div>
        {/* </div> */}
      </div>
    )
  }
}

Terminal.defaultProps = {
  heading: 'Tool(s) Terminal v1.0',
  prompt: 'tools:~ human$',
  textColor: 'text-indigo-400',
  messages: [],
  animated: false,
  onCancel(){}
}
export default Terminal;