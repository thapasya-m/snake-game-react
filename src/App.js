import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvasWidth: 300,
      canvasHeight: 300,
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
      },
      frogPosition: {
        x: 0,
        y: 0
      },
      score: 0
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.directionKeyPressed)
    this.createFrog();
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
    const { currentDirection } = this.state;
    setTimeout(() => {
      this.clearCanvas();
      this.drawFrog();
      if (!this.didSnakeDie()) {
        this.moveSnake(currentDirection);
        this.drawSnake();
        this.movingSlow()
      } else {
        this.drawSnake();
        if (window.confirm("You lost with " + this.state.score + " point(s). Click ok to restart.")) {
          window.location.reload()
        }
      }

    }, 100);
  }
  drawSnake() {
    const { snake } = this.state
    snake.forEach(this.drawSnakePart);
    this.drawBoard();
  }
  clearCanvas() {
    const canvas = document.getElementById("snake_board"), { canvasWidth, canvasHeight } = this.state
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
  }
  didSnakeDie() {
    const { snake, canvasHeight, canvasWidth } = this.state
    const head = { x: snake[0].x, y: snake[0].y }
    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true
      }
    }
    // snake.forEach(function checkIfSnakeBite(part) {

    // })
    if (head.x === 0 || head.x === canvasWidth - 10
      || head.y === 0 || head.y === canvasHeight - 10) {
      return true
    }
    return false
  }
  moveSnake(headTo) {
    const { snake, frogPosition } = this.state;
    const head = {
      x: snake[0].x + headTo.x,
      y: snake[0].y + headTo.y
    }
    snake.unshift(head);
    if (head.x === frogPosition.x && head.y === frogPosition.y) {
      this.gainPoint()
      this.createFrog();
    }
    else
      snake.pop();
  }
  gainPoint() {
    this.setState({
      score: this.state.score + 1
    })
  }
  createFrog() {

    const { frogPosition, snake, canvasWidth, canvasHeight } = this.state

    frogPosition.x = Math.round((Math.random() * (canvasWidth - 10)) / 10) * 10;
    frogPosition.y = Math.round((Math.random() * (canvasHeight - 10)) / 10) * 10;

    snake.forEach(function didSnakeEatFood(part) {
      const isFrogEaten = part.x === frogPosition.x && part.y ===
        frogPosition.y
      if (isFrogEaten) {
        console.log("ate")
        this.createFrog();
      }
    })
    this.drawFrog();
    this.drawBoard();
  }
  drawFrog() {
    const { frogPosition } = this.state;
    const canvas = document.getElementById("snake_board")
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = 'green'
      ctx.fillRect(frogPosition.x, frogPosition.y, 10, 10)
      ctx.strokeRect(frogPosition.x, frogPosition.y, 10, 10)
    }

  }
  drawBoard() {
    const canvas = document.getElementById("snake_board"),
      { canvasWidth, canvasHeight } = this.state,
      p = 0

    const context = canvas.getContext("2d");
    for (var x = 0; x <= canvasWidth; x += 10) {
      context.moveTo(0.5 + x + p, p);
      context.lineTo(0.5 + x + p, canvasHeight + p);
    }

    for (var y = 0; y <= canvasHeight; y += 10) {
      context.moveTo(p, 0.5 + y + p);
      context.lineTo(canvasWidth + p, 0.5 + y + p);
    }
    context.strokeStyle = "grey";
    context.stroke();
  }

  drawSnakePart(snakePart) {
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
        <aside>Score: {this.state.score}</aside>
      </div>
    );
  }

}

export default App;
