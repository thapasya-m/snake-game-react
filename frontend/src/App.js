import React, { Component } from 'react';
import './App.css';
import * as config from './settings'
import SnakeGame from './components/SnakeGame'
import UserPortal from './components/UserPortal';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scoreList: []
    }
  }

  getUserScoreBoard(isLoggedIn) {
    if (isLoggedIn) {
      const emailId = localStorage.getItem("userEmailId");
      if (emailId) {
        fetch(config.BASE_API + "/score/" + emailId,
          {
            method: "GET",
            headers: {
              'Content-Type': 'application/json'
            },
          }).then(response => {
            return response.json()
          }).then(respJSON => {
            if (respJSON.msg) {
              console.log(respJSON.msg);
            }
            if (respJSON.data) {
              this.setState({
                scoreList: respJSON.data
              })
            }
          })
      }
    } else {
      this.setState({
        scoreList: []
      })
    }


  }

  getNewScore = (score) => {
    this.setState({
      scoreList: [...this.state.scoreList, score]
    })
  }

  render() {
    return (
      <div className="App container row">
        <SnakeGame
          addNewScore={(score) => this.getNewScore(score)} />
        <UserPortal
          scoreList={this.state.scoreList}
          toggleSignIn={(flag) => this.getUserScoreBoard(flag)} />
      </div>
    );
  }

}

export default App;
