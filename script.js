var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var x = canvas.width/2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleX = 400;

const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 150;

const BRICK_WIDTH = 82;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 32;

var brickRowCount = 8;
var brickColCount = 8;

var rightPressed = false;
var leftPressed = false;
var another = true;

var score = 0;
var randX = 0;
var randY = 150;

var bricks = [];
//brick colours
var gradient = ctx.createLinearGradient(0,0,170,500);
gradient.addColorStop("0","magenta");
gradient.addColorStop("0.5","blue");
gradient.addColorStop("1.0","red");
//background Colour
var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
grd.addColorStop(0, "#ff3333");
grd.addColorStop(1, "#7733ff");

for(var i = 0; i < brickColCount; i++) {
	bricks[i] = [];
	for(var j = 0; j < brickRowCount; j++) {
		bricks[i][j] = {x: 0, y: 0, status: 1};
	}
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
	if(e.keyCode == 39 || e.keyCode == 68) {
		rightPressed = true;
	} else if(e.keyCode == 37 || e.keyCode == 65) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if(e.keyCode == 39 || e.keyCode == 68) {
		rightPressed = false;
	} else if(e.keyCode == 37 || e.keyCode == 65) {
		leftPressed = false;
	}
}

function drawBricks(color) {
	for(var i = 0; i < brickColCount; i++) {
		for(var j = 0; j < brickRowCount; j++) {
			if(bricks[i][j].status == 1) {
				var brickX = (i*(BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
				var brickY = (j*(BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
				bricks[i][j].x = brickX;
				bricks[i][j].y = brickY;
				ctx.strokeStyle = color;
				ctx.lineWidth=5;
				ctx.strokeRect(brickX,brickY,BRICK_WIDTH,BRICK_HEIGHT);
				/*ctx.beginPath();
				ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
				ctx.fillStyle = color;
				ctx.fill();
				ctx.closePath();*/
			}
			
		}
	}
}

function drawBall(color) {
	ctx.beginPath();
	ctx.arc(x, y, BALL_RADIUS, 0, Math.PI*2, false);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(color) {
	ctx.beginPath();
	ctx.rect(paddleX, (canvas.height - PADDLE_HEIGHT - 2), PADDLE_WIDTH, PADDLE_HEIGHT);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawScore() {
	ctx.font = "200px Arial";
	ctx.fillStyle = 'black';
	ctx.fillText(score, randX, randY);
}

function collisionDetection() {
	for(var i = 0; i < brickColCount; i++) {
		for(var j = 0; j < brickRowCount; j++) {
			var b = bricks[i][j];
			if(b.status == 1) {
				if(x > b.x && x < b.x + BRICK_WIDTH && y > b.y && y < b.y + BRICK_HEIGHT) {
				dy = -dy;
				b.status = 0;
				score += 100;
				var mod = Math.floor(Math.random()*10000)+1;
				randX = mod % 350;
				randY = (mod % 430) + 150;
				}
			}
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = grd;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	drawScore();
	drawBricks(gradient);
	if(another) {drawBall('#FFFFFF');}
	drawPaddle('#4730E5');
	collisionDetection();
	


	if(y + dy < BALL_RADIUS) {
		dy = -dy;
	} else if(y + dy + BALL_RADIUS > canvas.height){
		if(x > paddleX && x < paddleX + PADDLE_WIDTH) {
			dy = -dy;
			var deltaX = x - (paddleX+PADDLE_WIDTH/2);
				dx = deltaX * 0.15;
		} else {
			alert('Game Over');
			if(confirm('Another game?')){
				document.location.reload();
			} else {
				x = 0;
				y = 0;
				another = false;
				return;
			}
		}
		
	}
	if(x + dx < BALL_RADIUS || x + dx + BALL_RADIUS > canvas.width) {
		dx = -dx;
	}

	if(rightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
		paddleX += 7;
	} else if(leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	x += dx;
	y += dy;
}

setInterval(draw, 10);