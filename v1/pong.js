// Animation
var animate = window.requestAnimationFrame || 
window.webkitRequestAnimationFrame || 
window.mozRequestAnimationFrame || 
function(callback){
	window.setTimeout(callback, 1000/60)
}; 

// Set up Canvas
var canvas  = document.createElement('canvas'), 
	width   = 400, 
	height  = 600, 
	context = canvas.getContext('2d'); 

canvas.width  = width; 
canvas.height = height;  

// Attach canvas to screen and call a step function using animate method
window.onload = function(){
	document.body.appendChild(canvas); 
	animate(step); 
}

// Step function - 1. Update player paddle, 2. Update computer paddle, and 3. Ball
var step = function(){
	update(); 
	render(); 
	animate(step); 
}

var update = function(){
}; 

var render = function(){
	context.fillStyle = "#FBEAEB"; 
	context.fillRect(0, 0, width, height); 
}

// Adds objects so they can be rendered to the screen
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = "#2F3C7E";
  context.fillRect(this.x, this.y, this.width, this.height);
};

// Creates objects to represent the player and the computer
function Player(){
	this.paddle = new Paddle(175, 580, 50, 10); 
}

function Computer(){
	this.paddle = new Paddle(175, 10, 50, 10); 
}

// Render the paddles
Player.prototype.render = function(){
	this.paddle.render(); 
}; 

Computer.prototype.render = function(){
	this.paddle.render(); 
}; 

// Create the ball
function Ball(x, y){
	this.x = x; 
	this.y = y; 
	this.x_speed = 0; 
	this.y_speed = 3; 
	this.radius = 5; 
}

Ball.prototype.render = function(){
	context.beginPath(); 
	context.arc(this.x, this.y, this.radius, 2*Math.PI, false); 
	context.fillStyle = "#2F3C7E"; 
	context.fill(); 
}; 

// Build the objects and update the render function
var player   = new Player(), 
	computer = new Computer(), 
	ball     = new Ball(200, 300); 

var render = function(){
	context.fillStyle = "#FBEAEB"; 
	context.fillRect(0, 0, width, height); 
	player.render(); 
	computer.render(); 
	ball.render(); 
}; 

// Animate the ball
var update = function(){
	ball.update(); 
}; 

Ball.prototype.update = function(){
	this.x += this.x_speed; 
	this.y += this.y_speed; 
}; 

// Make the balls bounce off the paddles
var update = function(){
	ball.update(player.paddle, computer.paddle); 
}; 

Ball.prototype.update = function(paddle1, paddle2){
	this.x += this.x_speed; 
	this.y += this.y_speed; 
	var top_x    = this.x - 5, 
		top_y    = this.y - 5,
		bottom_x = this.x + 5, 
		bottom_y = this.y + 5;

	if(this.x - 5 < 0){ // hitting the left wall
		this.x = 5; 
		this.x_speed = -this.x_speed; 
	} else if(this.x + 5 > 400) { // hitting the right wall
		this.x = 395; 
		this.x_speed = -this.x_speed; 
	}

	if(this.y < 0 || this.y > 600){ // a point was scored
		this.x_speed = 0; 
		this.y_speed = 3; 
		this.x = 200; 
		this.y = 300; 
	}

	if(top_y > 300) {
	    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
	      // hit the player's paddle
	      this.y_speed = -3;
	      this.x_speed += (paddle1.x_speed / 2);
	      this.y += this.y_speed;
	    }
  	} else {
	    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
	      // hit the computer's paddle
	      this.y_speed = 3;
	      this.x_speed += (paddle2.x_speed / 2);
	      this.y += this.y_speed;
	    }
  	}
}; 

// Adds in the controls
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

// Update the position of the player's paddle depending on what key was pressed
var update = function() {
  player.update();
  ball.update(player.paddle, computer.paddle);
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-4, 0);
    } else if (value == 39) { // right arrow
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 400) { // all the way to the right
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
}

// Computer AI
var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -4) { // max speed left
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed right
    diff = 5;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 400) {
    this.paddle.x = 400 - this.paddle.width;
  }
};

