import React from 'react';
import Panel from '../common/Panel/Panel';
import SubPanelChooseNode from '../PanelXMLtoJSON/SubPanelChooseNode';
import SubPanelConvertToJSON from '../PanelXMLtoJSON/SubPanelConvertToJSON';
import SubPanelChooseFile from '../PanelXMLtoJSON/SubPanelChooseFile';
import SubPanelFileComplete from './SubPanelFileComplete';
import Container from '../common/Container/Container';
import StepHeader from '../common/Steps/StepHeader';

const { ipcRenderer } = window.require("electron");

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

    ipcRenderer.invoke("showDialogChooseXMLFile", "Let's choose a file.");
    
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

    ipcRenderer.on("parseXMLFileChosenError", this.handleParseXmlFileChosenError);
    ipcRenderer.on("choseXMLFile", this.handleChoseXmlFile);
    ipcRenderer.on('xmlDataParsed', this.handleXmlDataParsed);
    ipcRenderer.on('xmlToJsonComplete', this.handleXmlToJsonComplete);
    ipcRenderer.on('xmlToJsonError', this.handleXmlToJsonError);
    ipcRenderer.on("parseXMLFileChosenTagFound", this.handleParseXMLFileChosenTagFound);
    ipcRenderer.on('parseXMLFileChosenTagsFound', this.handleParseXMLFileChosenTagsFound);    
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

  handleXmlDataParsed = (e, message) => {
    const xmlCount = this.state.xmlDataParsed;
      this.setState({
        xmlDataParsed: xmlCount + 1,
        errorMessage: null,
      });
  }

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

    ipcRenderer.invoke("parseXMLFileChosen", {
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
    ipcRenderer.invoke("parseXMLFileChosenWithNode", {
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

    this.props.onCancel();
  }

  handleUnregisterListeners = () => {
    ipcRenderer.removeListener("parseXMLFileChosenError", this.handleParseXmlFileChosenError);
    ipcRenderer.removeListener("choseXMLFile", this.handleChoseXmlFile);
    ipcRenderer.removeListener('xmlDataParsed', this.handleXmlDataParsed);
    ipcRenderer.removeListener('xmlToJsonComplete', this.handleXmlToJsonComplete);
    ipcRenderer.removeListener('xmlToJsonError', this.handleXmlToJsonError);
    ipcRenderer.removeListener("parseXMLFileChosenTagFound", this.handleParseXMLFileChosenTagFound);
    ipcRenderer.removeListener('parseXMLFileChosenTagsFound', this.handleParseXMLFileChosenTagsFound);  
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