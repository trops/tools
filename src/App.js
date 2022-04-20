import React from 'react';
import MainMenu from "./components/MainMenu";
import TopAction from "./components/TopAction";
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee, faFile, faHandPointer, faFileArrowDown, faXmark, faWindowClose, faWindowRestore, faWindowMaximize, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { faHashnode } from '@fortawesome/free-brands-svg-icons';

library.add(
  faCoffee, 
  faCheckSquare, 
  faHashnode, 
  faFile, 
  faHandPointer, 
  faFileArrowDown,
  faXmark,
  faWindowClose,
  faWindowMinimize,
  faWindowRestore,
  faWindowMaximize
)
class App extends React.Component {q

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      chosen: null
    };
  }

  handleChoose = (chosen) => {
    this.setState({
      chosen
    });
  }

  handleHome = () => {
    this.setState({
      chosen: null
    });
  }

  render() {
    const { chosen } = this.state;
    return (
      <div className="bg-gray-300 h-screen flex flex-col w-full justify-between items-center align-middle overflow-hidden">
        <Header onCancel={this.handleHome} chosen={chosen} />
          <TopAction chosen={chosen} onCancel={() => this.setState({ chosen: null })} />
          { chosen === null && <MainMenu onChoose={this.handleChoose} />}
        <Footer onCancel={this.handleHome} chosen={false} />
      </div>
    );
  }
}

export default App;
