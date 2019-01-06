// Pipe is exported (eslint flags)
/* exported Pipe */

class Pipe {
  constructor() {
    this.spacing = 230;//230 easy, 210 normal, 190 hard
    this.top = random(height / 6, 3 / 4 * height);
    this.bottom = this.top + this.spacing;

    this.x = width;
    this.w = 80;
    this.speed = 5;//5 easy, 7 normal, 10 hard

    this.passed = false;
    this.highlight = false;
  }

  hits(bird) {
    let halfBirdHeight = bird.height / 2;
    let halfBirdwidth = bird.width / 2;
    if (bird.y - halfBirdHeight < this.top || bird.y + halfBirdHeight > this.bottom) {
      if (bird.x + halfBirdwidth > this.x && bird.x - halfBirdwidth < this.x + this.w) {
        this.highlight = true;
        this.passed = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }

  //this function is used to calculate scores and checks if it went through the pipes
  pass(bird) {
    if (bird.x > this.x && !this.passed) {
      this.passed = true;
      return true;
    }
    return false;
  }

  drawHalf() {
    let howManyNedeed = 0;
    let peakRatio = pipePeakSprite.height / pipePeakSprite.width;
    let bodyRatio = pipeBodySprite.height / pipeBodySprite.width;
    //this calculates, how many tubes it can fit without stretching
    howManyNedeed = Math.round(height / (this.w * bodyRatio));
    for (let i = 0; i < howManyNedeed; ++i) {
      let offset = this.w * (i * bodyRatio + peakRatio);
      image(pipeBodySprite, -this.w / 2, offset, this.w, this.w * bodyRatio);
    }
    image(pipePeakSprite, -this.w / 2, 0, this.w, this.w * peakRatio);
  }

  show() {
    push();
    translate(this.x + this.w / 2, this.bottom);
    this.drawHalf();
    translate(0, -this.spacing);
    rotate(PI);
    this.drawHalf();
    pop();
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return (this.x < -this.w);
  }
}
