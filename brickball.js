var ballX = 75;
var ballY = 75;

var ballSpeedX = 5
var ballSpeedY = 7
const ballImg = new Image();
// console.log(ballImg)
const brickImage = new Image()
brickImage.src = "brickImg.png"
ballImg.src ="ball.png"
const BRICK_W = 80;
const BRICK_H = 60; 
const BRICK_GAP = 0;
const BRICK_COLS = 10;
const BRICK_ROWS = 7; 
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var bricksLeft = 0;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60
var paddleX = 400;

var canvas, canvasContext;

 var  mouseX = 0;
 var  mouseY = 0;

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
	var root = document.documentElement

    mouseX = evt.clientX - rect.left - root.scrollLeft; 
    mouseY = evt.clientY - rect.top - root.scrollTop;
	
	paddleX = mouseX - PADDLE_WIDTH/2;
	
	// hack to test ball
	/*ballX = mouseX;
	ballY = mouseY;
	ballSpeedX = 4;
	ballSpeedY = -4;*/
}

function brickReset() {
    bricksLeft = 0;
	var i;
	for(i= 0;i<2 * BRICK_COLS;i++) {
        brickGrid[i] = false;	
	}
    for (;i < BRICK_COLS * BRICK_ROWS;i++) {
	     brickGrid[i] = true;
		 bricksLeft++;
	} // end of for each brick
}  // end of brickReset	func

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);
	
	canvas.addEventListener('mousemove', updateMousePos)
	
	brickReset();
	ballReset();
}

function updateAll() { 
    // moveAll();
    drawAll();
}

function ballReset() {
    ballX = canvas.width/2
	ballY = canvas.height/2+100
}

function ballMove(){
    ballX += ballSpeedX;
    ballY += ballSpeedY;
	
	if(ballX < 0 && ballSpeedX < 0.0) { // left
	    ballSpeedX *= -1;
	}
	if(ballX > canvas.width && ballSpeedX > 0.0) { //right
	    ballSpeedX *= -1;
	
	}
	if(ballY < 0 && ballSpeedY < 0.0) { // top
	    ballSpeedY *= -1;
	}
	if(ballY > canvas.height) { //bottom
	    ballReset();
		brickReset();
	}
}

function isBrickAtColRow(col,row) {
	if(col >= 0 && col < BRICK_COLS &&
       row >= 0 && row < BRICK_ROWS) {
	   var brickIndexUnderCoord = rowColToArrayIndex(col,row);
       return brickGrid[brickIndexUnderCoord];
	} else {
        return false;
	}
}   

// function ballBrickHandling() {
//     var ballBrickCol = Math.floor(ballX / BRICK_W);
// 	var ballBrickRow = Math.floor(ballY / BRICK_H);
// 	var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
	
// 	if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
//        ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
	   
// 		if(isBrickAtColRow( ballBrickCol,ballBrickRow)) {
// 		    brickGrid[brickIndexUnderBall] = false;
// 			bricksLeft--;
// 			// console.log(bricksLeft);
			
// 			var prevBallX = ballX - ballSpeedX;
// 			var prevBallY = ballY - ballSpeedY;
// 			var prevBrickCol = Math.floor(prevBallX / BRICK_W);
// 			var prevBrickRow = Math.floor(prevBallY / BRICK_H);
			
// 			var bothTestsFalied = true;
			
// 			if(prevBrickCol != ballBrickCol) {
//             if(isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {		 
//                     ballSpeedX *= -1;
// 		    bothTestsFalied = false;
// 		        }
// 			}
//             if(prevBrickRow != ballBrickRow) {
// 			    if(isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
// 				    ballSpeedY *= -1;
// 					bothTestsFalied = false;
// 		        }
// 			}
			
// 			if(bothTestsFalied) { // armpit case, prevents ball from going through
// 			    ballSpeedX *= -1;
// 				ballSpeedY *= -1;
// 			}
			
// 	    } // end of brick found	
//     } // end of valid col and row
// } // end of ballBrickHandling func

function ballPaddleHandling() {
    var paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE;	
	var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
	var paddleLeftEdgeX = paddleX;	
	var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
	if( ballY > paddleTopEdgeY && // below the top of paddle
	        ballY < paddleBottomEdgeY && // above bottom of paddle
	        ballX > paddleLeftEdgeX && // right of the left side of paddle
		    ballX < paddleRightEdgeX) {// left of the right side of paddle
			
            ballSpeedY *= -1;
			
			var centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
            var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
            ballSpeedX = ballDistFromPaddleCenterX * 0.35
            
		if( bricksLeft == 0) {
		     brickReset();
		}// out of brick
	} // ball center inside padde
} // end of ball paddleHandling

// function moveAll(){	
//     ballMove();
	
// 	ballBrickHandling();
    
// 	// ballPaddleHandling()
	
// }

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}

function drawBricks() {
    
	for(var eachRow=0;eachRow<BRICK_ROWS;eachRow++) {
        for(var eachCol=0;eachCol<BRICK_COLS;eachCol++) {
	        
			var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
			
			if(brickGrid[arrayIndex]){
                                drawBrickInCanvas(BRICK_W*eachCol,BRICK_H*eachRow,
          		                 BRICK_W-BRICK_GAP,BRICK_H-BRICK_GAP, 'white');
	              } // end of is this brick here
               } // end of for each brick
       } // end of each row 

} //end of drawBricks func

function drawAll() {
    colorRect(0,0, canvas.width,canvas.height, 'white'); // clear screen
	
	colorCircle(ballX,ballY); // draw ball
	
	colorRect(paddleX, canvas.height- PADDLE_DIST_FROM_EDGE,
	          PADDLE_WIDTH,PADDLE_THICKNESS, 'black');
			  
	drawBricks();
	
}	

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
        canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}
function drawBrickInCanvas(topLeftX,topLeftY, boxWidth,boxHeight) {
    // canvasContext.fillStyle = fillColor;
canvasContext.drawImage(brickImage,topLeftX,topLeftY, boxWidth,boxHeight);
}
 function colorCircle(centerX,centerY ) {
        canvasContext.drawImage(ballImg,centerX,centerY,50,50)
}

function colorText(showWords, textX,textY, fillColor) {
    canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX,textY);
}	
