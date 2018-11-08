// P5 exported functions (eslint flags)
/* exported preload, setup, draw, keyPressed */

// Exported sprites (eslint flags)
/* exported birdSprite, pipeBodySprite, pipePeakSprite */

var bird;
var pipes;
var parallax = 0.8;
var score = 0;
var maxScore = 0;
var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;
var bgX;
var gameoverFrame = 0;
var isOver = false;

var touched = false;
var prevTouched = touched;


function preload() {
  pipeBodySprite = loadImage('graphics/iron_pipe.jpg');
  pipePeakSprite = loadImage('graphics/iron_pipe.jpg');
  birdSprite = loadImage('graphics/key.png');
  bgImg = loadImage('graphics/background_2.png');
}

function setup() {
  createCanvas(1200, 675);
  reset();
}

function draw() {
  background(0);
  // Draw the background image, then move it at the same speed as the pipes
  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= pipes[0].speed * parallax;

  // this handles the "infinite loop" by checking if the right
  // edge of the image would be on the screen, if it is draw a
  // second copy of the image right next to it
  // once the second image gets to the 0 point, we can reset bgX to
  // 0 and go back to drawing just one image.
  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    if (pipes[i].pass(bird)) {
      score++;
    }
    if (score >  9){
      gamewon();
    }
    if (pipes[i].hits(bird)) {
      gameover();
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.show();

  if ((frameCount - gameoverFrame) % 150 == 0) {
    pipes.push(new Pipe());
  }

  showScores();

  // touches is an list that contains the positions of all
  // current touch points positions and IDs
  // here it check if touches' length is bigger than one
  // and set it to the touched var
  touched = (touches.length > 0);

  // if user has touched then make bird jump
  // also checks if not touched before
  if (touched && !prevTouched) {
    bird.up();
  }

  // updates prevTouched
  prevTouched = touched;


}
function gameover() {
  fill(200,0,0);
  textSize(64);
  textAlign(CENTER, CENTER);
  text('Failed to unlock', width / 2, height / 2);
  textAlign(LEFT, BASELINE);
  //maxScore = max(score, maxScore);
  isOver = true;
  noLoop();

}
function showScores() {
  fill(0,0,200);
  textSize(32);
  text('score: ' + score, 100, 32);
  text('Press Space to jump ',500,32);
  //text('record: ' + maxScore, 1, 64);
}

function gamewon(){
  fill(0,200,0);
  textSize(64);
  //textAlign(CENTER,CENTER);
  text('Unlocked', width / 2, height / 2);
  //maxScore = max(score, maxScore);
  isOver = true;
  noLoop();

}
function reset() {
  isOver = false;
  score = 0;
  bgX = 0;
  pipes = [];
  bird = new Bird();
  pipes.push(new Pipe());
  gameoverFrame = frameCount - 1;
  loop();
}

function keyPressed() {
  if (key === ' ') {
    bird.up();
    if (isOver) reset(); //you can just call reset() in Machinelearning if you die, because you cant simulate keyPress with code.
  }
}

function touchStarted() {
  if (isOver) reset();
}
