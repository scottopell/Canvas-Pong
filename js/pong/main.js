var player1, player2, ball, canvas, resetButton;
var amICheating = false;
var paused = false;
space = 32;
upArrow = 38;

function keydown(e){

	if(e.keyCode == upArrow){
		//up
		player1.moveUp();
	} else if(e.keyCode == 40) {
		//down
		player1.moveDown();
	}
};
function keyup(e){
	console.log(e.keyCode);
	if (e.keyCode == space){
		paused = !paused;
	} else if(e.keyCode == upArrow) {
		//up
		player1.dontMove();
	} else if(e.keyCode == 40) {
		//down
		player1.dontMove();
	} else if (e.keyCode == 67) {
		if (amICheating){
			stopCheating();
		} else {
			startCheating();
		}
	}
};
function checkChange(e){
	if (e.srcElement.checked){
		startCheating();
	} else {
		stopCheating();
	}
};
function startCheating(){
	amICheating = true;
	player1.speed += 10;
};
function stopCheating(){
	amICheating = false;
	player1.speed -= 10;
}
/*
function mouseup(e){
	var x;
	var y;
	if (e.pageX || e.pageY) { 
	  x = e.pageX;
	  y = e.pageY;
	}
	else { 
	  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	x -= gCanvasElement.offsetLeft;
	y -= gCanvasElement.offsetTop;
	
	if (x >
}
*/
function Player(x,y,w,h){
	var canvas = document.getElementById('drawhere');
	var ctx = canvas.getContext('2d');
	this.speed = 10;
	this.points = 0;
	this.direction = 0;
	this.x = x;
	this.y = y;
	this.mod = Math.random();
	this.width = typeof x !== 'undefined' ? 10 : w;
	this.height = typeof y !== 'undefined' ? 70 : h;
	this.draw = function (){
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.font = '18px sans-serif';
		ctx.textBaseline = 'top';
		ctx.fillText (this.points,this.x+10,5);
	};
	this.score = function(){
		this.points += 1;
		ball.reset();
		ball.xdirection *= -1;
		ball.draw();
	};
	this.moveUp = function(){
		this.direction = -1;
	};
	this.moveDown = function(){
		this.direction = 1;
	};
	this.dontMove = function (){
		this.direction = 0;
	};    
};
function intersectRect(player, ball) {
  return !( ball.x > player.x + player.width || 
		   ball.x + ball.size < player.x || 
		   ball.y > player.y + player.height ||
		   ball.y + ball.size < player.y);
};

function Ball(x,y,size){
	var canvas = document.getElementById('drawhere');
	var ctx = canvas.getContext('2d');
	this.x = typeof x == 'undefined' ? canvas.width / 2 : x;
	this.y = typeof y == 'undefined' ? canvas.height / 2 : y;
	this.size = typeof size == 'undefined' ? 10 : size;
	this.xdirection = 1;
	this.ydirection = 1;
	this.speed = 5.5;
	this.draw = function (){
		ctx.fillRect(this.x,this.y,this.size,this.size);
	};
	this.move = function (){
		this.x += (this.xdirection*this.speed);
		if (intersectRect(player1, ball) || intersectRect(player2, ball)){
			this.xdirection *= -1
			this.x += (this.xdirection*this.speed)
			player2.mod = Math.random();
		}
		this.y += (this.ydirection*this.speed);
		if (intersectRect(player1, ball) || intersectRect(player2, ball)){
			this.ydirection *= -1
			this.y += (this.ydirection*this.speed)
			player2.mod = Math.random();
		}
	};
	this.check = function (){
		var canvas = document.getElementById('drawhere');
		if (this.x + this.size > canvas.width  || this.x < 0){
			//this.xdirection *= -1
		if (this.x + this.size > canvas.width){
			player1.score();
		}
		if (this.x < 0){
			player2.score();
		}
		}
		if (this.y + this.size > canvas.height || this.y < 0){
			this.ydirection *= -1
		}
	};
	this.reset = function(){
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
	};
};



window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();

function animloop(){
	  requestAnimFrame( animloop );
	  render();
};

function render(){
	var canvas = document.getElementById('drawhere');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,canvas.width,canvas.height);
	action();
	ctx.fillStyle = '#336699';
	if (!paused){
		player1.draw();
		player2.draw();
		ball.draw();
	}
};
function action(){
	var canvas = document.getElementById('drawhere');
	var ctx = canvas.getContext('2d');
	ball.check();
	if (!paused){
		ball.move();
		player1.move();
		player2.move();
	}
	else{
		ctx.font = '30px sans-serif';
		ctx.textBaseline = 'top';
		ctx.fillText ('Press Space to Resume',canvas.width/2 - 150,canvas.height/2);
	
	}
};
function init(){
	cheatbox = document.getElementById('cheat');
	if (document.addEventListener){
		//document.addEventListener("mouseup",mouseup,false);
		document.addEventListener("keydown",keydown,false);
		document.addEventListener("keyup",keyup,false);
		document.addEventListener("change", checkChange, false);
	} else if (document.attachEvent){
		//document.attachEvent("onmouseup",mouseup);
		document.attachEvent("onkeydown", keydown);
		document.attachEvent("onkeyup", keyup);
	} else {
		//document.onmouseup = mouseup;
		document.onkeydown = keydown;
		document.onkeyup = keyup;
	}
	


	var canvas = document.getElementById('drawhere');

	player1 = new Player(canvas.width*.1,canvas.height*.9);
	player1.move = this.move = function(){
		if (this.direction == 1 && (this.y + this.height >= canvas.height))
				return;
		else if (this.direction == -1 && this.y <= 0 )
				return;
		this.y += this.speed*this.direction;    
	};

	player2 = new Player(canvas.width*.9,canvas.height*.9);

	player2.move = function() {
	//collisions
		if (ball.ydirection == 1 && (this.y + this.height + 1 >= canvas.height))
			return;
		else if (ball.ydirection == -1 && this.y <= 0 )
			return;
	//AI	
		if (this.y < ball.y && this.y + this.height > ball.y + ball.size)
				this.direction = 0;
		else if ((this.y + this.height / 2) > ball.y)
			this.direction = -1;
		else if ((this.y + this.height / 2) < ball.y)
			this.direction = 1;

		this.y += this.speed * this.direction;

		//this.y += ball.y *ball.ydirection;//( ball.y - this.y ) * Math.pow(ball.x / (canvas.width * 2.1), 2.5 ); 
	};
	
	player2.move = function() {
		//collisions
		if (ball.ydirection == 1 && (this.y + this.height + 1 >= canvas.height))
				return;
		else if (ball.ydirection == -1 && this.y <= 0 )
				return;

		projected_t = (this.x - ball.x) / ball.speed*ball.xdirection;
		projected_y = ball.y + ((ball.speed * ball.ydirection) * projected_t) - this.height/2;
		rand = this.mod;
		if (rand <= .8)
			;//nothing
		else if (rand >= .8 && rand <= .9)
			projected_y += this.height * 2;
		else 
			projected_y -= this.height * 2;
	
	
		if (ball.xdirection == 1) {
			if (this.y < projected_y && this.y + this.height > projected_y) {
				this.direction = 0;
			} else if (projected_y > this.y) {
				this.direction = 1;
			} else if (projected_y < this.y) {
				this.direction = -1;
			}
		} else if (ball.xdirection == -1) {
			middle = this.y + this.height / 2;
			if (middle > canvas.height / 2)
				this.direction  = -1;
			else if (middle < canvas.height / 2)
				this.direction = 1;	
		}
		this.y += this.speed * this.direction;
	};


	player2.speed = 3;
	ball = new Ball();
	render();
	animloop();
};
