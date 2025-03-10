/*
    MIT License

    Copyright (c) 2017 Le Garage

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

// Class representing the game
class Game {
  // Build a new game with the given pixel width and height
  constructor(width, height) {
    // At the beginnig, no movement is set, the game is paused
    this.nextMove = undefined;
    this.alreadyMoved = false;
    this.width = width;
    this.height = height;
    this.tileWidth = width / 60;
    this.tileHeight = height / 60;
    // Initialize a 1 sized snake at the center of the game board
    this.snake = [
      [
        Math.round(width / (2 * this.tileWidth)),
        Math.round(height / (2 * this.tileHeight))
      ]
    ];
    this.food = undefined;
    this.gameover = false;
    this.scoreHtmlElmt = document.getElementById("score");
    this.addFood();
  }

  // Callback function called when a keyboard key
  // is pushed down
  keyDown(e) {
    //Get the pause popup div
    var popup = document.getElementById("pausePopup");

    switch (e.key) {
      case "ArrowLeft":
        if (this.nextMove != "right" && !this.alreadyMoved) {
          this.nextMove = "left";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowUp":
        if (this.nextMove != "down" && !this.alreadyMoved) {
          this.nextMove = "up";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowRight":
        if (this.nextMove != "left" && !this.alreadyMoved) {
          this.nextMove = "right";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowDown":
        if (this.nextMove != "up" && !this.alreadyMoved) {
          this.nextMove = "down";
          this.alreadyMoved = true;
        }
        break;
      case " ":
        this.nextMove = undefined;
        this.alreadyMoved = false;
        break;
      default:
        // Do nothing just ignore it
        break;
    }
  }

  // Add a food somewhere in the game (randomly)
  addFood() {
    var x = Math.floor(Math.random() * 60);
    var y = Math.floor(Math.random() * 60);

    for (var i = 0; i < this.snake.length; i++) {
      var xy = this.snake[i];

      if (xy[0] == x && xy[1] == y) {
        return this.addFood();
      }
    }

    this.food = [x, y];
  }

  // Update the game state with the next move
  update() {
    if (this.gameover) return;
    this.alreadyMoved = false;
    var newHead = this.snake[0].slice();
    switch (this.nextMove) {
      case undefined:
        return;
        break;
      case "left":
        newHead[0] -= 1;
        break;
      case "up":
        newHead[1] -= 1;
        break;
      case "right":
        newHead[0] += 1;
        break;
      case "down":
        newHead[1] += 1;
        break;
      default:
        throw "Unexpected move";
    }

    // Game Over If snake is going out ouf the game
    if (newHead[0] < 0) {
      this.gameover = true;
      newHead[0] = 0;
    } else if (newHead[0] >= Math.round(this.width / this.tileWidth)) {
      this.gameover = true;
      newHead[0] = Math.round(this.width / this.tileWidth) - 1;
    }
    if (newHead[1] < 0) {
      this.gameover = true;
      newHead[1] = 0;
    } else if (newHead[1] >= Math.round(this.height / this.tileHeight)) {
      this.gameover = true;
      newHead[1] = Math.round(this.height / this.tileHeight) - 1;
    }

    if (this.gameover) return;

    //Check if next move is on some food
    if (newHead[0] == this.food[0] && newHead[1] == this.food[1]) {
      // Move food to another place
      //This place must not be somewhere on the snake
      this.addFood();
    } else {
      this.snake.pop(); //Don't grow the snake
    }
    // Push the snake's new head position
    this.snake.unshift(newHead);

    // Game Over If snake bites itself
    for (var i = 1; i < this.snake.length; i++) {
      if (newHead[0] == this.snake[i][0] && newHead[1] == this.snake[i][1]) {
        this.gameover = true;
        return;
      }
    }
  }

  // Draw / render the current game state
  render(ctx) {
    // Clear the screen
    ctx.clearRect(0, 0, this.width, this.height);

    // Update score HTML element
    this.scoreHtmlElmt.textContent = this.snake.length - 1;

    // Draw the borders
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, this.width, this.height);

    // Draw the snake
    ctx.fillStyle = "blue";
    for (var i = 0; i < this.snake.length; i++) {
      var xy = this.snake[i];
      ctx.fillRect(
        xy[0] * this.tileWidth,
        xy[1] * this.tileHeight,
        this.tileWidth,
        this.tileHeight
      );
    }

    // Draw the food
    var food = new Image();
    food.src = "js/Phone.jpg";
    ctx.drawImage(
      food,
      this.food[0] * this.tileWidth,
      this.food[1] * this.tileHeight - food.height / 4
    );
    //GameOver
    if (this.gameover) {
      document.querySelector("#restart").classList.remove("hide");
      var audio = new AudioPlay();
      audio.pause();
      ctx.font = "48px serif";
      ctx.fillStyle = "black";
      var displayGameOver = "GAME OVER";
      var text = ctx.measureText(displayGameOver);
      ctx.fillText(
        displayGameOver,
        (this.width - text.width) / 2,
        this.height / 2
      );
      // return;

      // Quick restart on key down
      document.onkeydown = function() {
        restart();
      };
    }
  }

  restart() {}
}

function start() {
  const audio = document.getElementById("myAudio");
  audio.play();
  var canvas = document.getElementById("game");
  game = new Game(canvas.width, canvas.height);
  document.onkeydown = function(e) {
    game.keyDown(e);
  };
  var ctx = canvas.getContext("2d");
  loop(game, ctx);
}

// The game update and rendering loop
function loop(game, ctx) {
  game.update();
  game.render(ctx);
  // every 5 food eaten, increase spead by 10 ms
  var snakeFastIndex = Math.floor(game.snake.length / 5);
  if (snakeFastIndex == 0) {
    var speed = 80;
  } else {
    // if speed should be faster to 30 ms, keep it to 30 ms, so the player can still play
    if (snakeFastIndex > 5) {
      var speed = 30;
    } else {
      var speed = 80 - 10 * snakeFastIndex;
    }
  }
  setTimeout(function() {
    loop(game, ctx);
  }, speed);
}

function restart() {
  location.reload();
}
