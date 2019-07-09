import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: {
        left: 37,
        up: 38,
        right: 39,
        down: 40
      },
      snake: [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 }
      ],
      currentDirection: {
        x: -10,
        y: 0
      }
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.directionKeyPressed)
    this.movingSlow();
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.directionKeyPressed)
  }
  isNextStepAllowed(_nextDirection) {
    const previousDirection = this.state.currentDirection
    if (Math.abs(previousDirection.x) === Math.abs(_nextDirection.x)) {
      return false
    }
    return true
  }
  directionKeyPressed = (e) => {
    const { key } = this.state
    let _nextDirection = {}
    const keyPressed = e.keyCode
    switch (keyPressed) {
      case key.left:
        _nextDirection = { x: -10, y: 0 }
        if (this.isNextStepAllowed(_nextDirection)) {
          this.setState({ currentDirection: _nextDirection })
        }
        break;
      case key.up:
        _nextDirection = { x: 0, y: -10 }
        if (this.isNextStepAllowed(_nextDirection)) {
          this.setState({ currentDirection: _nextDirection })
        }
        break;
      case key.right:
        _nextDirection = { x: 10, y: 0 }
        if (this.isNextStepAllowed(_nextDirection)) {
          this.setState({ currentDirection: _nextDirection })
        }
        break;
      case key.down:
        _nextDirection = { x: 0, y: 10 }
        if (this.isNextStepAllowed(_nextDirection)) {
          this.setState({ currentDirection: _nextDirection })
        }
        break;
    }
  }
  movingSlow() {
    const { snake, currentDirection } = this.state;
    setTimeout(() => {
      this.clearCanvas()
      this.moveSnake(currentDirection);
      snake.forEach(this.drawSnake);
      this.movingSlow()
    }, 100);
  }
  clearCanvas() {
    const canvas = document.getElementById("snake_board")
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }
  moveSnake(headTo) {
    const { snake } = this.state;
    const head = {
      x: snake[0].x + headTo.x,
      y: snake[0].y + headTo.y
    }
    snake.unshift(head);
    snake.pop();
    // this.setState({
    //   snake: snake
    // })
  }
  drawSnake(snakePart) {
    const canvas = document.getElementById("snake_board")
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = 'red'
      ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
      ctx.strokeRect(snakePart.x, snakePart.y, 10, 10)
    }
  }
  render() {

    return (
      <div className="App">
        <header className="">
          Snake game
        </header>
        <canvas
          style={{ border: "1px solid black" }}
          id="snake_board" width="300" height="300">
        </canvas>
        <aside>Score: 0</aside>
      </div>
    );
  }

}

export default App;
