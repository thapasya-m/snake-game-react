import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      snake: [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 }
      ]
    }
  }
  componentDidMount() {
    const { snake } = this.state;
    snake.forEach(this.drawSnake);
    this.movingSlow();
  }
  movingSlow() {
    const { snake } = this.state;
    setTimeout(() => {
      this.clearCanvas()
      // this.moveSnake({ x: 0, y: -10 });
      this.moveSnake({ x: 0, y: -10 });
      snake.forEach(this.drawSnake);
      this.movingSlow()
    }, 1000);
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
    this.setState({
      snake: snake
    })
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
      <div className="App" >
        <header className="">
          Snake game
      </header>
        <canvas
          style={{ border: "1px solid black" }}
          id="snake_board" width="300" height="300">
          current stock price: $3.15 + 0.15
      </canvas>
        <aside>Score: 0</aside>
      </div>
    );
  }

}

export default App;
