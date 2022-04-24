import React from 'react';
import Panel from '../common/Panel/Panel';
// import SubPanelChooseNode from '../PanelXMLtoJSON/SubPanelChooseNode';
// import SubPanelConvertToJSON from '../PanelXMLtoJSON/SubPanelConvertToJSON';
import SubPanelChooseFile from '../PanelJSONtoJSON/SubPanelChooseFile';
import SubPanelMapJSONKeys from '../PanelJSONtoJSON/SubPanelMapJSONKeys';
// import SubPanelFileComplete from './SubPanelFileComplete';
import Container from '../common/Container/Container';
import StepHeader from '../common/Steps/StepHeader';

const mainApi = window.mainApi;
const renderEvents = mainApi.renderEvents;

const steps = {
  1: {
    name: "Choose File",
  },
  2: {
    name: "Choose Keys"
  },
  3: {
    name: "to JSON"
  },
  4: {
    name: "File Complete"
  }
};

class PanelJSONtoJSON extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceFile: null,
      outputFile: null,
      errorMessage: null,
      isProcessing: true,
      keysFound: [],
      step: 1,
    };
  }
  
  /**
   * Step 1: Choose a file using the dialog window
   */
  openFileWindow = () => {

    // unregister listeners if any are left...
    this.handleUnregisterListeners();

    // lets open the dialog window to choose a file
    mainApi.jsonMap.showDialogChooseJSONFile();

    // Register ipcRenderer listeners using the API (contextBridge)
    /**
     * User selected a file
     */
    mainApi.on(renderEvents.RENDER_MAP_JSON_CHOSE_FILE, this.handleChoseFile);
    /**
     * Error selecting a file, possibly bad file extension, etc.
     */
    mainApi.on(renderEvents.RENDER_MAP_JSON_CHOSE_FILE_ERROR, this.handleChoseFileError);
    /**
     * JSON file has been parsed to find the keys in the first node
     */
    mainApi.on(renderEvents.RENDER_MAP_JSON_FOUND_KEYS, this.handleListJSONKeysFound);
    // mainApi.on(renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODE_FOUND, this.handleParseXMLFileChosenTagFound);
    // mainApi.on(renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODES_COMPLETE, this.handleParseXMLFileChosenTagsFound);
    // mainApi.on(renderEvents.RENDER_PARSE_SPLIT_XML_NODE, this.handleXmlDataParsed);
    // mainApi.on(renderEvents.RENDER_PARSE_XML_TO_JSON_COMPLETE, this.handleXmlToJsonComplete);
    // mainApi.on(renderEvents.RENDER_PARSE_XML_TO_JSON_ERROR, this.handleXmlToJsonError);

    this.setState({
      sourceFile: null,
      outputFile: null,
      errorMessage: null
    });
  }


  // // renderer handlers for electron
  
  handleParseJSONFileChosenError = (e, message) => {
    this.setState({
      errorMessage: message.message
    });
  }

  handleChoseFile = (e, message) => {
    console.log('handle chose file');
    this.setState({
      sourceFile: message.filepath,
      outputFile: message.toFilepath,
    }, () => {
      // kickoff the fetching of the keys...
      mainApi.jsonMap.findKeysInJsonFile(message.filepath);
    });
  }

  handleChoseFileError = (e, message) => {
    this.setState({
      errorMessage: message.message
    });
  }

  // /**
  //  * handleXmlDataParsed
  //  * This is called when the XMLSplitter finds a SINGLE node and we parse that into JSON
  //  * @param {object} message the { node, tag, path } of the XML node found
  //  */
  // handleXmlDataParsed = (e, message) => {
  //   const xmlCount = this.state.xmlDataParsed;
  //   this.setState({
  //     xmlDataParsed: xmlCount + 1,
  //     errorMessage: null,
  //   });
  // }

  // /**
  //  * handleXmlToJsonComplete
  //  * All the nodes have been converted (end)
  //  */
  // handleXmlToJsonComplete = (e, message) => {
  //   this.setState({
  //     complete: true,
  //     isProcessing: true,
  //     errorMessage: null,
  //   });
  // }

  // handleXmlToJsonError = (e, message) => {
  //   this.setState({
  //     errorMessage: message,
  //     step: 4
  //   });
  // }

  // handleParseXMLFileChosenTagFound = (e, message) => {
  //   const nodes = this.state.nodeFound;
  //   nodes.push(message.node);
  //   this.setState({
  //     tagsFound: [],
  //     nodeFound: nodes,
  //     errorMessage: null,
  //   });
  // }

  // handleParseXMLFileChosenTagsFound = (e, message) => {
  //   this.setState({
  //     tagsFound: message.tags,
  //     step: 2,
  //     errorMessage: null,
  //   });
  // }

  // // component handlers
  // handleNodeToExtract = (e) => {
  //   this.setState({
  //     nodeToExtract: e.target.value,
  //     errorMessage: null,
  //   });
  // }

  /**
   * List the keys we have found in the JSON file selected
   */
  handleListJSONKeysFound = (e, message) => {
    console.log('MESSAGE: ', message);

    this.setState({
      isProcessing: true,
      keysFound: message,
      step: 2,
      errorMessage: null,
    });


  }

  // handleChooseTag = tag => {
  //   this.setState({
  //     isProcessing: true,
  //     nodeToExtract: tag,
  //     step: 3,
  //     errorMessage: null,
  //     xmlDataParsed: 0,
  //     complete: false,
  //   });
  //   const { sourceXML, toJSON } = this.state;
  //   mainApi.parseXML.parseXMLFileChosenWithNode({
  //     filepath: sourceXML,
  //     toFilepath: toJSON,
  //     nodeToExtract: tag
  //   });
  // }

  // handleCancel = () => {

  //   this.setState({
  //     sourceXML: null,
  //     toJSON: null,
  //     xmlDataParsed: 0,
  //     complete: false,
  //     nodeToExtract: '',
  //     isProcessing: false,
  //     tagsFound: [],
  //     step: 1,
  //     errorMessage: null,
  //     nodeFound: []
  //   });

  //   // unregister listeners
  //   this.handleUnregisterListeners();

  //   // cancel the window
  //   this.props.onCancel();
  // }

  handleUnregisterListeners = () => {
    mainApi.removeAllListeners();
  }

  // handleStartOver = () => {
  //   this.setState({
  //     sourceXML: null,
  //     toJSON: null,
  //     xmlDataParsed: 0,
  //     complete: false,
  //     nodeToExtract: '',
  //     isProcessing: false,
  //     tagsFound: [],
  //     step: 1,
  //     errorMessage: null,
  //     nodeFound: []
  //   });

  //   // unregister listeners
  //   this.handleUnregisterListeners();
  // }

  // handleStepClick = stepNumber => {
  //   switch(stepNumber) {
  //     case "2":
  //       this.setState({
  //         step: stepNumber,
  //         errorMessage: null,
  //         tagsFound: [],
  //         nodeFound: [],
  //         xmlDataParsed: 0,
  //         complete: false,
  //       });  
  //     break;
  //     default:
  //       this.setState({
  //         step: stepNumber,
  //         errorMessage: null,
  //       });  
  //     break;
  //   }
  // }

  render() {
    const { step, errorMessage, keysFound, complete } = this.state;
    return (
      <Container>
        <StepHeader step={step} steps={steps} onClick={this.handleStepClick} />
        <Panel errorMessage={errorMessage}>
          {step === 1 && <SubPanelChooseFile onCancel={this.handleCancel} onClick={this.openFileWindow} />}
          {step === 2 && <SubPanelMapJSONKeys onCancel={this.handleCancel} onClick={this.openFileWindow} keysArray={keysFound['keysArray']} jsonData={keysFound['jsonData']} dotData={keysFound['dotData']}/>}
          {/*
          {step === 2 && <SubPanelChooseNode nodes={tagsFound} complete={tagsFound.length > 0} nodeFound={nodeFound} onChooseNode={this.handleChooseTag} onCancel={this.handleStartOver} />}
          {step === 3 && <SubPanelConvertToJSON xmlDataParsed={xmlDataParsed} xmlDataParsedArray={xmlDataParsedArray} sourceFile={sourceXML} outFile={toJSON} complete={complete} onCancel={this.handleStartOver} onComplete={() => this.handleStepClick(4)}/>}
          {step === 4 && <SubPanelFileComplete fileLocation={toJSON} onCancel={this.handleStartOver} />} 
          */}
        </Panel>
        </Container>
    );
  }
}

PanelJSONtoJSON.defaultProps = {
  onCancel(){}
}

export default PanelJSONtoJSON;