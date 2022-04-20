import React from 'react';
import Panel from '../common/Panel/Panel';
import SubPanelChooseNode from '../PanelXMLtoJSON/SubPanelChooseNode';
import SubPanelConvertToJSON from '../PanelXMLtoJSON/SubPanelConvertToJSON';
import SubPanelChooseFile from '../PanelXMLtoJSON/SubPanelChooseFile';
import SubPanelFileComplete from './SubPanelFileComplete';
import Container from '../common/Container/Container';
import StepHeader from '../common/Steps/StepHeader';


const { ipcRenderer } = require("electron");
const mainApi = window.mainApi;

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

class PanelJSONToJSON extends React.Component {
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
    mainApi.send("showDialogChooseXMLFile", "Let's choose a file.");
    
    this.setState({
      sourceXML: null,
      toJSON: null,
      xmlDataParsed: 0,
      complete: false,
      nodeToExtract: null,
      isProcessing: false,
      tagsFound: [],
      step: 1,
      errorMessage: null
    });

    mainApi.handle("parseXMLFileChosenError", (e, message) => {
      this.setState({
        errorMessage: message.message
      });
    });

    // The user has successfully chosen a file, and now we will 
    // process this file to pull out the nodes available for extraction
    mainApi.handle("choseXMLFile", (e, message) => {
      this.setState({
        sourceXML: message.filepath,
        toJSON: message.toFilepath,
        xmlDataParsed: 0,
        complete: false,
        isProcessing: false,
        nodeToExtract: '',
        step: 2,
        errorMessage: null,
      });
      // simply run this...
      this.handleProcessXML();
    });

    mainApi.handle('xmlDataParsed', (e, message) => {
      const xmlCount = this.state.xmlDataParsed;
      this.setState({
        xmlDataParsed: xmlCount + 1,
        errorMessage: null,
      })
    });

    mainApi.handle('xmlToJsonComplete', (e, message) => {
      this.setState({
        complete: true,
        isProcessing: true,
        step: 4,
        errorMessage: null,
      });
    });

    mainApi.handle('xmlToJsonError', (e, message) => {
      this.setState({
        errorMessage: message,
        step: 4
      });
    });

    mainApi.handle("parseXMLFileChosenTagFound", (e, message) => {
      const nodes = this.state.nodeFound;
      nodes.push(message.node);
      this.setState({
        nodeFound: nodes,
        errorMessage: null,
      });
    });

    mainApi.handle('parseXMLFileChosenTagsFound', (e, message) => {
      this.setState({
        tagsFound: message.tags,
        step: 2,
        errorMessage: null,
      }, () => {
        console.log('here.');
      });
    });
  }

  handleNodeToExtract = (e) => {
    console.log(e.target.value);
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
      step: 2,
      errorMessage: null,
    });
    const { sourceXML, toJSON } = this.state;
    mainApi.send("parseXMLFileChosen", {
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
    });
    const { sourceXML, toJSON } = this.state;
    mainApi.send("parseXMLFileChosenWithNode", {
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
      nodeToExtract: null,
      errorMessage: null,
    });
    this.props.onCancel();
  }

  handleStepClick = stepNumber => {
    console.log('clicked ', stepNumber);
    this.setState({
      step: stepNumber,
      errorMessage: null,
    });
  }

  render() {
    const { step, toJSON, xmlDataParsed, tagsFound, nodeFound, errorMessage } = this.state;
    return (
      <Container>
        <StepHeader step={step} steps={steps} onClick={this.handleStepClick} />
        <Panel>
          {errorMessage && (
            <div className="flex w-full text-sm p-2 mt-2 rounded-sm bg-indigo-400 text-white">{errorMessage}</div>
          )}
          {step === 1 && <SubPanelChooseFile onCancel={this.handleCancel} onClick={this.openFileWindow} />}
          {/* {step === 2 && <SubPanelFindNodes onClick={this.handleProcessXML} onCancel={this.handleCancel} />} */}
          {step === 2 && <SubPanelChooseNode nodes={tagsFound} nodeFound={nodeFound} onChooseNode={this.handleChooseTag} onCancel={() => this.handleStepClick(1)} />}
          {step === 3 && <SubPanelConvertToJSON xmlDataParsed={xmlDataParsed} onCancel={() => this.handleStepClick(2)} />}
          {step === 4 && <SubPanelFileComplete fileLocation={toJSON} onCancel={() => this.handleStepClick(1)} />}
        </Panel>
        </Container>
    );
  }
}

PanelJSONToJSON.defaultProps = {
  onCancel(){}
}

export default PanelJSONToJSON;