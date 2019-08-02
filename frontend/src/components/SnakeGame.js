import React, { Component } from 'react';
import * as config from '../settings'

class SnakeGame extends Component {
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
            context: "",
            canvas: "",
            frogPosition: {
                x: 0,
                y: 0
            },
            score: 0,
            isPaused: false,
            isWalled: false
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.directionKeyPressed)
        const canvas = document.getElementById("snake_board")
        const context = canvas.getContext("2d")
        this.setState({
            context: context,
            canvas: canvas
        })
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
    storeScore() {
        const emailId = localStorage.getItem("userEmailId");
        if (emailId) {
            const data = {
                emailId: emailId,
                score: this.state.score
            }
            fetch(config.BASE_API + "/score",
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(response => {
                    return response.json()
                }).then(respJSON => {
                    if (respJSON.msg) {
                        alert("something went wrong");
                        console.log(respJSON.msg);
                    }
                    if (respJSON.data) {
                        this.props.addNewScore(respJSON.data)
                    }
                })
        }
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
            default:
                break;
        }
    }
    movingSlow() {
        const { currentDirection, frogPosition, isPaused, isWalled } = this.state;
        setTimeout(() => {
            this.clearCanvas();
            this.justDraw(frogPosition, "green");
            if (!this.didSnakeDie()) {
                if (!isPaused) {
                    this.moveSnake(currentDirection);
                    this.drawSnake();
                    this.movingSlow()
                } else
                    this.drawSnake();
            } else {
                this.drawSnake();
                if (this.state.score > 0)
                    this.storeScore();
                window.alert("You lost with " + this.state.score + " point(s).")
                this.setState({
                    score: 0,
                    snake: [
                        { x: 150, y: 150 },
                        { x: 140, y: 150 },
                        { x: 130, y: 150 },
                        { x: 120, y: 150 }
                    ]
                });
                this.clearCanvas();
                this.createFrog();
                this.movingSlow();

            }
        }, 300);
    }
    drawSnake() {
        const { snake } = this.state
        for (let i = 0; i < snake.length; i++) {
            this.justDraw(snake[i], "red")
        }
        this.drawBoard();
    }
    clearCanvas() {
        const { canvasWidth, canvasHeight, context } = this.state

        if (context !== "") {
            context.fillStyle = "white";
            context.strokeStyle = "black";
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            context.strokeRect(0, 0, canvasWidth, canvasHeight);
        }
    }
    didSnakeDie() {
        const { snake, isWalled } = this.state
        const head = { x: snake[0].x, y: snake[0].y }
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                return true
            }
        }
        if (isWalled && this.didSnakeHitWall(head)) {
            return true
        }

        return false
    }
    didSnakeHitWall(coords) {
        const { canvasHeight, canvasWidth } = this.state
        if (coords.x === 0 || coords.x === canvasWidth - 10
            || coords.y === 0 || coords.y === canvasHeight - 10) {
            return true
        }
    }
    getPosition(val, mod) {
        return ((val % mod) + mod) % mod;
    }
    moveSnake(headTo) {
        const { snake, frogPosition, canvasHeight, canvasWidth } = this.state;
        const head = {
            x: this.getPosition(snake[0].x + headTo.x, canvasWidth),
            y: this.getPosition(snake[0].y + headTo.y, canvasHeight)
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

        for (let i = 0; i < snake.length; i++) {
            const isFrogEaten = snake[i].x === frogPosition.x && snake[i].y ===
                frogPosition.y
            if (isFrogEaten) {
                console.log("ate")
                this.createFrog();
            }
        }

        this.justDraw(frogPosition, "green");
        this.drawBoard();
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

    justDraw(coords, fillColor) {
        const { canvas } = this.state;
        if (canvas.getContext) {
            const context = canvas.getContext("2d")
            context.fillStyle = fillColor
            context.fillRect(coords.x, coords.y, 10, 10)
            context.strokeRect(coords.x, coords.y, 10, 10)
        }
    }
    toggleGame = () => {
        let _isPaused = this.state.isPaused
        this.setState({
            isPaused: !_isPaused
        })
    }
    toggleStage = () => {
        let _isWalled = this.state.isWalled
        this.setState({
            isWalled: !_isWalled
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.state.isPaused !== prevState.isPaused)
            && !this.state.isPaused) {
            this.movingSlow();
        }
    }
    render() {
        const { isPaused, score, isWalled } = this.state;
        return (
            <div className="col-8">
                <header className="">
                    Snake game
                </header>
                <canvas
                    style={{ border: "1px solid black" }}
                    id="snake_board" width="300" height="300">
                </canvas>
                <aside>Score: {score}</aside>
                <div className="container d-flex justify-content-between col-6">
                    <button className="btn btn-primary " onClick={() => this.toggleGame()}>
                        {!isPaused ? "Pause" : "Resume"}</button>
                    <button className="btn btn-success"
                        onClick={() => this.toggleStage()}>
                        {isWalled ? "Down the wall!" : "Walls up!"}</button>

                </div>
            </div>
        );
    }

}

export default SnakeGame;
