import React from 'react';
import Panel from '../common/Panel/Panel';
import SubPanelChooseNode from '../PanelXMLtoJSON/SubPanelChooseNode';
import SubPanelConvertToJSON from '../PanelXMLtoJSON/SubPanelConvertToJSON';
import SubPanelChooseFile from '../PanelXMLtoJSON/SubPanelChooseFile';
import SubPanelFileComplete from './SubPanelFileComplete';
import Container from '../common/Container/Container';
import StepHeader from '../common/Steps/StepHeader';

const mainApi = window.mainApi;
const renderEvents = mainApi.renderEvents;
// const { ipcRenderer } = require("electron");

const steps = {
  1: {
    name: "Choose File",
  },
  2: {
    name: "Choose Node"
  },
  3: {
    name: "to JSON"
  },
  4: {
    name: "File Complete"
  }
};

class PanelXMLToJSON extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceXML: null,
      toJSON: null,
      xmlDataParsed: 0,
      complete: false,
      nodeToExtract: '',
      isProcessing: false,
      tagsFound: [],
      step: 1,
      errorMessage: null,
      nodeFound: []
    };
  }
  
  /**
   * Step 1: Choose a file using the dialog window
   */
  openFileWindow = () => {

    // unregister listeners if any are left...
    this.handleUnregisterListeners();

    // lets open the dialog window to choose a file
    mainApi.parseXML.showDialogChooseXMLFile();

    // Register ipcRenderer listeners using the API (contextBridge)
    mainApi.on(renderEvents.RENDER_PARSE_XML_CHOSE_FILE, this.handleChoseXmlFile);
    mainApi.on(renderEvents.RENDER_PARSE_XML_CHOSE_FILE_ERROR, this.handleParseXmlFileChosenError);
    mainApi.on(renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODE_FOUND, this.handleParseXMLFileChosenTagFound);
    mainApi.on(renderEvents.RENDER_PARSE_XML_FILE_CHOSEN_NODES_COMPLETE, this.handleParseXMLFileChosenTagsFound);
    mainApi.on(renderEvents.RENDER_PARSE_SPLIT_XML_NODE, this.handleXmlDataParsed);
    mainApi.on(renderEvents.RENDER_PARSE_XML_TO_JSON_COMPLETE, this.handleXmlToJsonComplete);
    mainApi.on(renderEvents.RENDER_PARSE_XML_TO_JSON_ERROR, this.handleXmlToJsonError);

    this.setState({
      sourceXML: null,
      toJSON: null,
      xmlDataParsed: 0,
      complete: false,
      nodeToExtract: null,
      isProcessing: false,
      tagsFound: [],
      nodeFound: [],
      step: 1,
      errorMessage: null
    });
  }


  // renderer handlers for electron
  
  handleParseXmlFileChosenError = (e, message) => {
    this.setState({
      errorMessage: message.message
    });
  }

  handleChoseXmlFile = (e, message) => {
    this.setState({
      sourceXML: message.filepath,
      toJSON: message.toFilepath,
      xmlDataParsed: 0,
      xmlDataParsedArray: [],
      complete: false,
      isProcessing: false,
      nodeToExtract: '',
      step: 2,
      errorMessage: null,
      tagsFound: [],
      nodeFound: []
    }, () => {
      this.handleProcessXML();
    });
  }

  /**
   * handleXmlDataParsed
   * This is called when the XMLSplitter finds a SINGLE node and we parse that into JSON
   * @param {object} message the { node, tag, path } of the XML node found
   */
  handleXmlDataParsed = (e, message) => {
    const xmlCount = this.state.xmlDataParsed;
    this.setState({
      xmlDataParsed: xmlCount + 1,
      errorMessage: null,
    });
  }

  /**
   * handleXmlToJsonComplete
   * All the nodes have been converted (end)
   */
  handleXmlToJsonComplete = (e, message) => {
    this.setState({
      complete: true,
      isProcessing: true,
      errorMessage: null,
    });
  }

  handleXmlToJsonError = (e, message) => {
    this.setState({
      errorMessage: message,
      step: 4
    });
  }

  handleParseXMLFileChosenTagFound = (e, message) => {
    const nodes = this.state.nodeFound;
    nodes.push(message.node);
    this.setState({
      tagsFound: [],
      nodeFound: nodes,
      errorMessage: null,
    });
  }

  handleParseXMLFileChosenTagsFound = (e, message) => {
    this.setState({
      tagsFound: message.tags,
      step: 2,
      errorMessage: null,
    });
  }

  // component handlers
  handleNodeToExtract = (e) => {
    this.setState({
      nodeToExtract: e.target.value,
      errorMessage: null,
    });
  }

  /**
   * Process the XML to find the nodes we have to choose from
   */
  handleProcessXML = () => {
    this.setState({
      isProcessing: true,
      tagsFound: [],
      nodeFound: [],
      step: 2,
      errorMessage: null,
    });

    const { sourceXML, toJSON } = this.state;
    mainApi.parseXML.parseXMLFileChosen({
      filepath: sourceXML,
      toFilepath: toJSON
    });
  }

  handleChooseTag = tag => {
    this.setState({
      isProcessing: true,
      nodeToExtract: tag,
      step: 3,
      errorMessage: null,
      xmlDataParsed: 0,
      complete: false,
    });
    const { sourceXML, toJSON } = this.state;
    mainApi.parseXML.parseXMLFileChosenWithNode({
      filepath: sourceXML,
      toFilepath: toJSON,
      nodeToExtract: tag
    });
  }

  handleCancel = () => {

    this.setState({
      sourceXML: null,
      toJSON: null,
      xmlDataParsed: 0,
      complete: false,
      nodeToExtract: '',
      isProcessing: false,
      tagsFound: [],
      step: 1,
      errorMessage: null,
      nodeFound: []
    });

    // unregister listeners
    this.handleUnregisterListeners();

    // cancel the window
    this.props.onCancel();
  }

  handleUnregisterListeners = () => {
    mainApi.removeAllListeners();
  }

  handleStartOver = () => {
    this.setState({
      sourceXML: null,
      toJSON: null,
      xmlDataParsed: 0,
      complete: false,
      nodeToExtract: '',
      isProcessing: false,
      tagsFound: [],
      step: 1,
      errorMessage: null,
      nodeFound: []
    });

    // unregister listeners
    this.handleUnregisterListeners();
  }

  handleStepClick = stepNumber => {
    switch(stepNumber) {
      case "2":
        this.setState({
          step: stepNumber,
          errorMessage: null,
          tagsFound: [],
          nodeFound: [],
          xmlDataParsed: 0,
          complete: false,
        });  
      break;
      default:
        this.setState({
          step: stepNumber,
          errorMessage: null,
        });  
      break;
    }
  }

  render() {
    const { step, sourceXML, toJSON, xmlDataParsed, xmlDataParsedArray, tagsFound, nodeFound, errorMessage, complete } = this.state;
    return (
      <Container>
        <StepHeader step={step} steps={steps} onClick={this.handleStepClick} />
        <Panel errorMessage={errorMessage}>
          {step === 1 && <SubPanelChooseFile onCancel={this.handleCancel} onClick={this.openFileWindow} />}
          {step === 2 && <SubPanelChooseNode nodes={tagsFound} complete={tagsFound.length > 0} nodeFound={nodeFound} onChooseNode={this.handleChooseTag} onCancel={this.handleStartOver} />}
          {step === 3 && <SubPanelConvertToJSON xmlDataParsed={xmlDataParsed} xmlDataParsedArray={xmlDataParsedArray} sourceFile={sourceXML} outFile={toJSON} complete={complete} onCancel={this.handleStartOver} onComplete={() => this.handleStepClick(4)}/>}
          {step === 4 && <SubPanelFileComplete fileLocation={toJSON} onCancel={this.handleStartOver} />}
        </Panel>
        </Container>
    );
  }
}

PanelXMLToJSON.defaultProps = {
  onCancel(){}
}

export default PanelXMLToJSON;