//difficulties var timeleft,
//function draw () if(counter)//12.9 easy , 9.9 normal , 6.9 hard

let bubbles = [];

var score = 0;

var touched = false;
var prevTouched = touched;

var issOver = false;

var counter = 0;
var timeleft = 13;  //13 s to easy, 10 s normal, 7 s hard,

function convertSeconds (s){
  var min = floor(s / 60);
  var sec = s % 60;
  return nf(min , 2) + ':' + nf(sec , 2);
}

function setup() {
  createCanvas(1200, 675);
  for (let i = 0; i < 8; i++) {
    let x = random(100,1000);
    let y = random(100,500);
    let r = random(30, 30);
    let b = new Bubble(x, y, r);
    bubbles.push(b);
  }

  var params = getURLParams();
  if ( params.minute){
    var min = params.minute;
    timeleft = min * 60;
  }
  var timer  =  select('#timer');
  timer.html(convertSeconds(timeleft - counter));// id html timer

  var interval = setInterval(timeIt, 1000); // goes --up or ++down by 1 sec
  function timeIt(){
    counter++;
    timer.html(convertSeconds(timeleft - counter));
    if ( counter == timeleft){
      clearInterval(interval);

    }
  }
}


function mousePressed() {
  for (let i = bubbles.length -1;i >=0; i--) {
    if(bubbles[i].contains(mouseX,mouseY)){
      bubbles.splice(i,1);
      score++;
    }
  }
}


function draw() {
  background(0);
  for (let i = 0; i < bubbles.length; i++) {
    if(bubbles[i].contains(mouseX,mouseY)){
      bubbles[i].changeColor(255);
    }else{
      bubbles[i].changeColor(0);
    }
    bubbles[i].move();
    bubbles[i].show();

    if(score > 6){
      gamewwon();
    }
    if(counter > 9.9){ // = timeleft -0,1 //12.9 easy , 9.9 normal , 6.9 hard
      gamellost();
    }
  }
  showScores();
  touched = (touches.length > 0);

  prevTouched = touched;
}

class Bubble {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.brightness = 0;

  }
  changeColor(bright){
    this.brightness = bright;
  }

  contains(px,py) { // cheks the distance between mouse and struggle ellipse
    let d = dist( px, py, this.x, this.y);
    if (d < this.r) {
      return true;

    }
  }

  move() {
    this.x = this.x + random(-10, 10);
    this.y = this.y + random(-10, 10);
  }

  show() {
    stroke(255);
    strokeWeight(4);
    fill(this.brightness, 125);
    ellipse(this.x, this.y, this.r * 2);
  }
}

function gamewwon(){
  fill(0,200,0);
  textSize(64);
  text('You struggled out off the rope',100,300);
  noloop();
  issOver = true;
}

function gamellost(){
  fill(200,0,0);
  textSize(64);
  text('You struggle, but nothing happend',100,300);
  noloop();
  issOver = true;
}
function showScores(){
  fill(0,0,200);
  textSize(32);
  text('score :' +score,1050,660);
  text('press the mouse to get points',400,660);
}
function reset(){
  issOver = false;
  score = 0;
  b = new Bubble();
  loop();

}
function keyPressed(){
  if(key === ' '){
    bubbles.push();
    if (issOver) reset();
  }
}

function toucheStarted(){
  if (issOver) reset();
}

function Struggle_easy(){
  convertSeconds();
  setup();
  mousePressed();
  draw();
  constructor();
  changeColor();
  contains();
  move();
  show();
  gamewwon();
  gamellost();
  showScores();
  reset();
  keyPressed();
  toucheStarted();
}
Struggle_easy();
