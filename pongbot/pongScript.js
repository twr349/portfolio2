var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000/60)
};

var canvas = document.createElement('canvas');
var width = 600;
var height = 400;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

window.onload = function() {
  document.getElementById('canvasContainer').appendChild(canvas);
  animate(step);
};

var step = function() {
  update();
  render();
  animate(step);
};

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(300, 200);
var score = {
  human: 0,
  computer: 0
};

var render = function() {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = '#ffffff';
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
  this.paddle = new Paddle(15, 175, 10, 50);
}

function Computer() {
  this.paddle = new Paddle(575, 175, 10, 50);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) {
      this.paddle.move(0, -8);
    } else if (value == 40) {
      this.paddle.move(0, 8);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Computer.prototype.update = function(ball) {
  var y_pos = ball.y;
  var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
  if(diff < 0 && diff < -4) {
    diff = -5;
  } else if(diff > 0 && diff > 4) {
    diff = 5;
  }
  this.paddle.move(0, diff);
  if(this.paddle.y < 0) {
    this.paddle.y = 0;
  } else if (this.paddle.y + this.paddle.height > 400) {
    this.paddle.y = 400 - this.paddle.height;
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.y < 0) {
    this.y = 0;
    this.y_speed = 0;
  } else if (this.y + this.height > 400) {
    this.y = 400 - this.height;
    this.y_speed = 0;
  }
}

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 3;
  this.y_speed = 0;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#ffffff";
  context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var left_x = this.x - 5;
  var left_y = this.y - 5;
  var right_x = this.x + 5;
  var right_y = this.y + 5;

  if(this.y - 5 < 0) {
    this.y = 5;
    this.y_speed = -this.y_speed;
  } else if(this.y + 5 > 400) {
    this.y = 395;
    this.y_speed = -this.y_speed;
  }



  if(this.x < 0) {
    this.x_speed = 3;
    this.y_speed = Math.floor(Math.random() * 4);
    this.x = 300;
    this.y = 200;
    score.computer ++;
    document.getElementById('scoreComputer').innerHTML = score.computer;
    if (score.computer == 11) {
      this.x_speed = 0;
      this.y_speed = 0;
      document.getElementById('endGame').style.visibility = "visible";
    }
  }

  if(this.x > 600) {
    this.x_speed = -3;
    this.y_speed = Math.floor(Math.random() * 4);
    this.x = 300;
    this.y = 200;
    score.human ++;
    document.getElementById('scoreHuman').innerHTML = score.human;
    if (score.human == 11) {
      this.x_speed = 0;
      this.y_speed = 0;
      document.getElementById('winGame').style.visibility = "visible";
    }
  }

  if(left_x < 300) {
    if(left_x < (paddle1.x + paddle1.width) && right_x > paddle1.x && left_y < (paddle1.y + paddle1.height) && right_y > paddle1.y) {
      this.x_speed = 3;
      this.y_speed += (paddle1.y_speed / 2);
      this.x += this.x_speed;
    }
  } else {
    if(left_x < (paddle2.x + paddle2.width) && right_x > paddle2.x && left_y < (paddle2.y + paddle2.height) && right_y > paddle2.y) {
      this.x_speed = -3;
      this.y_speed += (paddle2.y_speed / 2);
      this.x += this.x_speed;
    }
  }
};
