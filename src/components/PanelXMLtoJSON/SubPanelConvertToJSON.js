import React from "react";
import Button from "../common/Button";
import Terminal from "../common/Panel/Terminal";

class SubPanelConvertToJSON extends React.Component {

  handleCancel = () => {
    this.props.onCancel();
  }

  generateTerminalMessages = () => {
    const { xmlDataParsed, sourceFile, outFile, complete } = this.props;
    const sourceTruncated = sourceFile.split('\\').pop().split('/').pop() || '';
    const outTruncated = outFile.split('\\').pop().split('/').pop() || '';
    const messages = [];
    messages.push({
      text: `./parse-xml -i ${sourceTruncated} -o ${outTruncated}`,
      showPrompt: true,
      showCursor: false
    });
    messages.push({
      text: 'Some nodes are large and take a moment, please be patient.',
      showPrompt: false,
      showCursor: false
    });
    messages.push({
      text: `Converting ${xmlDataParsed} nodes ...`,
      showPrompt: false,
      showCursor: false
    });
    if (xmlDataParsed > 3000) {
      messages.push({
        text: `Would you like to play a game? (Y/n)`,
        showPrompt: false,
        showCursor: false,
        color: 'text-yellow-500'
      });
    }
    
    if (xmlDataParsed > 3500) {
      messages.push({
        text: `Just kidding...`,
        showPrompt: false,
        showCursor: false,
      });
    }

    if (xmlDataParsed > 4000) {
      messages.push({
        text: `Silly human`,
        showPrompt: false,
        showCursor: false,
      });
    }

    if (xmlDataParsed > 4050) {
      messages.push({
        text: `This file is delicious`,
        showPrompt: false,
        showCursor: false,
      });
    }

    if (complete === true) {
      messages.push({
        text: `Generated ${xmlDataParsed} objects.`,
        showPrompt: false,
        showCursor: false,
        color: 'text-yellow-500'
      });
      messages.push({
        text: '',
        showPrompt: true,
        showCursor: true,
      });
    }

    if (complete === false) {
      messages.push({
        text: `Processing...`,
        showPrompt: false,
        showCursor: false,
        animated: true,
        color: 'text-yellow-700'
      });
    }

    return messages;
    
    // {xmlDataParsed > 2000 && xmlDataParsed < 3000 && <span className="flex w-full text-xs font-mono font-medium text-red-500 pb-1">Would you like to play a game? (Y/n)<span className="animate-pulse bg-red-500 h-full w-2 ml-2 opacity-90">&nbsp;</span></span>}
    // {xmlDataParsed > 3000 && <span className="flex w-full text-xs font-mono font-medium text-red-500 pb-1">Would you like to play a game? (Y/n) n</span>}
    // {xmlDataParsed > 3500 && <span className={`flex w-full text-xs font-mono font-medium text-red-500 pb-1`}>Just kidding ;-)</span>}
    // {xmlDataParsed > 4000 && <span className="flex w-full text-xs font-mono font-medium text-indigo-400 pb-1">Silly human :-)</span>}
    // {xmlDataParsed > 4001 && <span className="flex w-full text-xs font-mono font-medium text-indigo-400 pb-1">I'll keep parsing...</span>}
    
    // {complete === true && <span className={`flex w-full text-xs font-mono font-medium text-indigo-400 pb-1`}>Parsed {xmlDataParsed} records.</span>}
    // {complete === true && <span className={`flex w-full text-xs font-mono font-medium text-indigo-400 pb-1`}> tools:~ human$ <span className="animate-pulse bg-indigo-400 h-full w-2 ml-2 opacity-90">&nbsp;</span></span>}
    // {complete === false && <span className={`flex w-full text-xs font-mono font-medium text-indigo-400 pb-1 animate-pulse`}>Processing...</span>}
  }

  render() { 
    const { complete } = this.props;

    const messages = this.generateTerminalMessages();
    return (
      <div className="flex w-full flex-col flex-1 rounded space-y-2 h-full overflow-hidden">
        <div className="flex flex-1 flex-col space-y-2 w-full h-full overflow-hidden">
          <div className="flex flex-col justify-start h-full overflow-y-scroll">
              <Terminal messages={messages} />
          </div>
          {complete === true && <Button onClick={this.props.onComplete} title="Click to complete" size="small" color="bg-yellow-700" />}
        </div>
        </div>
    );
  }
}

SubPanelConvertToJSON.defaultProps = {
  onCancel(){},
  onComplete(){},
  xmlDataParsed: '',
  xmlDataParsedArray: [],
  sourceFile: '',
  outFile: '/Users/trash',
  complete: false
}

export default SubPanelConvertToJSON;