import React, { Component } from 'react';
import './App.css';
import SnakeGame from './components/SnakeGame'
import UserPortal from './components/UserPortal';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false
    }
  }

  onSignIn = () => {
    this.setState({
      isLoggedIn: !this.state.isLoggedIn
    })
  }

  render() {
    return (
      <div className="App container row">
        <SnakeGame />
        <UserPortal />
      </div>
    );
  }

}

export default App;
