const W = 600;
const H = 500;
const maxBricks = 10;
const brickWidth = W / maxBricks;
const brickHeight = 32;
var gameStarted = false;
var bounceCount = 0;
var ammo = document.getElementById("ammo");
var title = document.getElementById("title");
var myWindow = document.querySelector(".my-window");
var levelBricks = 0;
var life = 3;
var ball = {
  r: 15,
  x: W / 2,
  y: H - 13
};
var shadow = {
  offset: 8,
  opacity: 15
};
var maxBounce;
var pointsWindow = document.getElementById("points");
var startBtn = document.getElementById("start-game");
var menu = document.getElementById("menu");
var myBall;
var counter;
var bat;
var wall = [];
var balls = [];
var pointer;
var scoreBall;
var scoreBalls = [];
var clouds;
var clouds2;
var rockets = [];
var rocketsAmmo = 3;
var bonusRockets = [];
var bonusRocketIndex = 8;
var mountains = [];
var brokenBricks = [];
var levels = [];
var levelCounter = 0;
var startBool = false;
var windowWidth = window.innerWidth;
var cnvScale = 1;

window.onload = start();

function start() {
  startBtnPulse();
  setScale();
}

function setScale() {
  if (windowWidth < 1000) {
    cnvScale = windowWidth / W;
    cnvScale = Math.floor(cnvScale * 10) / 10;
  }
}

function startBtnPulse() {
  setInterval(function() {
    startBtn.classList.toggle("pulse");
  }, 200);
}

startBtn.addEventListener("click", function() {
  ammo.classList.toggle("hidden");
  title.classList.toggle("hidden");
  menu.classList.toggle("hidden");
  startBool = true;
  for (let i = 0; i < wall.length; i++) {
    brokenBricks.push(
      new BrokenBrick(wall[i].x, wall[i].y, Math.random() * 15 - 5)
    );
  }
  levelCounter++;
  reset();
  setTimeout(startGame, 100);
});

function startGame() {
  window.addEventListener("click", function(e) {
    play();
  });
}

window.addEventListener("wheel", function() {
  if (e.deltaY > 0) {
    pointer.aim(true);
  } else {
    pointer.aim(false);
  }
});

document.body.onkeyup = function(e) {
  if (e.keyCode == 32 && rocketsAmmo && gameStarted) {
    rockets.push(new Rocket(mouseX / cnvScale));
    rocketsAmmo--;
    updateRocketCounter();
  }
};

ammo.innerHTML = "Rockets:" + rocketsAmmo;

const level0 = [
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "d", "0", "d", "d", "0", "0", "0"],
  ["0", "0", "d", "d", "d", "d", "d", "d", "0", "0"],
  ["0", "d", "d", "d", "s", "d", "*", "d", "d", "0"],
  ["0", "0", "d", "d", "*", "0", "0", "d", "d", "0"],
  ["0", "0", "0", "d", "0", "0", "0", "d", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  [0]
];
levels.push(level0);

const level3 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "*", "d", "d", "d", "d", "s", "d", "*", 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "*", "d", "b", "d", "d", "d", "d", "*", 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, "*", "*", "*", "*", 0, 0, 0],
  [16]
];
levels.push(level3);

const level4 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, "d", "d", 0, 0, 0, 0],
  [0, 0, 0, "s", "d", "d", "d", 0, 0, 0],
  [0, 0, "d", "d", "d", "b", "d", "d", 0, 0],
  [0, "*", "b", "d", "d", "d", "d", "d", "*", 0],
  [0, 0, "*", "*", "*", "*", "*", "*", 0, 0],
  [16]
];
levels.push(level4);

const level1 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "d", "d", "d", "d", "*", "s", "d", "d", 0],
  [0, 0, "b", "*", "d", "d", "*", "d", 0, 0],
  [0, 0, 0, "*", "d", "d", "d", 0, 0, 0],
  [0, 0, 0, 0, "*", "d", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [10]
];
levels.push(level1);

const level2 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "*", "d", "d", "d", "d", "s", "d", "*", 0],
  [0, "*", "d", "s", "d", "d", "d", "d", "*", 0],
  [0, "*", "d", "d", "d", "b", "d", "d", "*", 0],
  [0, "*", "b", "d", "d", "d", "d", "d", "*", 0],
  [0, "*", "*", "*", "*", "*", "*", "*", "*", 0],
  [22]
];
levels.push(level2);

function updateLevel(level) {
  this.level = level;
  for (let i = 0; i < this.level.length; i++) {
    for (let j = 0; j < 11; j++) {
      switch (this.level[i][j]) {
        case 0:
          break;
        case "*":
          wall.push(
            new Brick(brickWidth * j, brickHeight * i, "indestructible")
          );
          break;
        case "d":
          wall.push(new Brick(brickWidth * j, brickHeight * i, ""));
          levelBricks++;
          break;
        case "s":
          wall.push(new Brick(brickWidth * j, brickHeight * i, "special"));
          levelBricks++;
          break;
        case "b":
          wall.push(new Brick(brickWidth * j, brickHeight * i, "rocketBonus"));
          levelBricks++;
          break;
      }
      maxBounce = this.level[this.level.length - 1][0];
    }
  }
}

function play() {
  gameStarted = true;
}

function setup() {
  updateRocketCounter();
  var cnv = createCanvas(W, H);
  cnv.style("display", "flex");
  cnv.style("position", "absolute");
  cnv.style("left", "50%");
  cnv.style("top", "50%");
  cnv.style("transform", "translate(-50%, -50%) scale(" + cnvScale + ")");
  clouds = new Clouds(100, 100, 50, 70);
  clouds2 = new Clouds(450, 200, 85, 45);
  reset();
}

function updateRocketCounter() {
  ammo.innerHTML = "Rockets:" + rocketsAmmo;
}

function endGame() {
  if (levelBricks === 0) {
    pointsWindow.innerHTML = "NEXT LEVEL!";
    setTimeout(function() {
      updateRocketCounter();
      pointsWindow.innerHTML = "";
    }, 1200);
    levelCounter++;
    reset();
  } else if (life === 0) {
    pointsWindow.innerHTML = "YOU SUCK !!";
    setTimeout(function() {
      updateRocketCounter();
      pointsWindow.innerHTML = "";
    }, 1200);
    reset();
  }
}

function reset() {
  wall = [];
  balls = [];
  scoreBalls = [];
  rockets = [];
  gameStarted = false;
  balls.push(new Ball(ball.x, ball.y, ball.r));
  bat = new Bat();
  pointer = new Pointer();
  life = 3;
  rocketsAmmo = 3;
  mountains.push(new Mountain(100, H, 550, 270, W + 200, H));
  mountains.push(new Mountain(-100, H, 200, 330, W, H));
  bounceCount = 0;
  levelBricks = 0;

  for (i = 0; i < 3; i++) {
    scoreBalls.push(new ScoreBall());
  }

  var y = 60;
  var j = 0;

  updateLevel(levels[levelCounter]);
}

function draw() {
  console.log();
  background(174, 217, 224);
  for (let i = 0; i < brokenBricks.length; i++) {
    brokenBricks[i].draw();
    brokenBricks[i].update();
  }
  clouds.draw();
  mountains[0].draw();
  clouds2.draw();
  mountains[1].draw();

  for (i = 0; i < rockets.length; i++) {
    rockets[i].draw();
    rockets[i].update();
  }

  if (gameStarted) {
    for (let i = 0; i < balls.length; i++) {
      balls[i].move();
      balls[i].draw();
      balls[i].update(bat.x1, bat.x2, bat.y);
    }
    for (let j = 0; j < scoreBalls.length; j++) {
      scoreBalls[j].draw(W - 15 - j * 25, 15);
    }
    bat.update();
  } else if (startBool) {
    pointer.draw();
    balls[0].draw();
    bat.draw();
  }

  let hitBrick = false;
  let bricksToDelete = [];

  for (let i = wall.length - 1; i >= 0; i--) {
    wall[i].draw();
    if (!hitBrick) {
      for (let b = 0; b < balls.length; b++) {
        hitBrick = balls[b].brickStrike(
          wall[i],
          wall[i].x,
          wall[i].y,
          wall[i].width,
          wall[i].height
        );
        if (hitBrick == true) {
          if (wall[i].life === 0) {
            bricksToDelete.push(i);
          }
        }
      }
    }
    for (let r = rockets.length - 1; r > -1; r--) {
      let hitRocket = rockets[r].update(
        wall[i].x,
        wall[i].y,
        wall[i].width,
        wall[i].height
      );
      if (hitRocket) {
        bricksToDelete.push(i);
        rockets.splice(r, 1);
      }
    }
  }
  bricksToDelete.forEach(function(index) {
    if (wall[index].type != "indestructible") {
      levelBricks--;
    }
    wall.splice(index, 1);
  });
  if (wall.length === 0) {
  }
  for (let j = 0; j < bonusRockets.length; j++) {
    bonusRockets[j].draw();
    bonusRockets[j].update(bat.x1, bat.x2, bat.y);
  }
  endGame();
}

function Ball(x, y, d, type) {
  this.x = x;
  this.y = y;
  this.d = d;
  this.dy = 6;
  this.dx = 5;
  this.thickness = 1;
  this.type = type;
  this.history = [];

  this.move = function() {
    this.y += this.dy;
    this.x += this.dx;
    var v = createVector(this.x, this.y);
    this.history.push(v);
    if (this.history.length > 20) {
      this.history.splice(0, 1);
    }
    for (var i = 0; i < this.history.length; i++) {
      fill(255, 160, 184);
      stroke(255, 160, 184);
      var pos = this.history[i];
      ellipse(pos.x, pos.y, i / 2 + 2, i / 2 + 2);
    }
  };

  this.draw = function() {
    if (this.type === "bonus") {
      stroke(255, 76, 121);
      fill(255, 76, 121);
    } else {
      stroke(255);
      fill(255);
    }
    strokeWeight(this.thickness);
    ellipse(this.x, this.y, this.d, this.d);
  };

  this.brickStrike = function(brick, brickX, brickY, brickWidth, brickHeight) {
    if (
      this.x > brickX &&
      this.x < brickX + brickWidth &&
      this.y - this.d / 2 < brickY + brickHeight &&
      this.y + this.d / 2 > brickY
    ) {
      this.dy = -this.dy;
      brick.strike(this.dx);
      return true;
    } else if (
      this.y > brickY &&
      this.y < brickY + brickHeight &&
      this.x + this.d / 2 > brickX &&
      this.x - this.d / 2 < brickX + brickWidth
    ) {
      brick.strike(this.dx);
      this.dx = -this.dx;
      return true;
    }
    return false;
  };

  this.update = function(batX1, batX2, batY) {
    if (
      this.x + this.d > batX1 &&
      this.x - this.d < batX2 &&
      this.y + this.d / 2 > batY
    ) {
      if (this.x < batX1 + 40 && this.dx > -8) {
        if (this.x < batX1 + 10 && this.dx > 0) {
          if (this.dx > 6) {
            this.dx = this.dx / 4;
          } else if (this.dx < 8) {
            this.dx = -this.dx;
          }
        } else {
          this.dx -= 2;
        }
      } else if (this.x > batX2 - 40 && this.dx < 8) {
        if (this.x > batX2 - 10 && this.dx < 0) {
          if (this.x < -6) {
            this.x = this.x / 4;
          } else if (this.dx >= -8) {
            this.dx = -this.dx;
          }
        } else {
          this.dx += 2;
        }
      }
      this.dy = -this.dy;
      if (this.type != "bonus") {
        bounceCount++;
      }
    } else if (this.y - this.d / 2 < 0 && this.dy < 0) {
      this.dy = -this.dy;
    } else if (
      (this.x - this.d / 2 < 0 && this.dx < 0) ||
      (this.x + this.d / 2 > W && this.dx > 0)
    ) {
      this.dx = -this.dx;
    } else if (this.y - this.d > H) {
      if (this.type === "bonus") {
        balls.splice(1, 1);
      } else {
        this.y = -20;
        life--;
        this.x = Math.random() * 540 + 30;
        scoreBalls.pop();
      }
    }
  };
}

function Bat() {
  this.width = 100;
  this.x1 = W / 2 - this.width / 2;
  this.x2 = W / 2 + this.width / 2;
  this.y = H;
  this.thickness = 12;
  this.highlighted = false;

  this.draw = function() {
    stroke(0);
    strokeWeight(16);
    line(this.x1, this.y, this.x2, this.y);
    if (this.highlighted === true) {
      stroke(100, 100, 255);
    } else {
      stroke(255, 50, 100);
    }
    strokeWeight(this.thickness);
    line(this.x1, this.y, this.x2, this.y);
  };

  this.update = function() {
    this.x1 = mouseX / cnvScale - 50;
    this.x2 = mouseX / cnvScale + 50;
    this.draw();
  };

  this.highlight = function() {
    const self = this;
    this.highlighted = !this.highlighted;
    ammo.style.fontSize = "20px";
    ammo.style.color = "rgb(255, 203, 99)";
    setTimeout(function() {
      self.highlighted = !self.highlighted;
      ammo.style.fontSize = "16px";
      ammo.style.color = "white";
    }, 300);
  };
}

function Brick(x, y, type) {
  this.x = x;
  this.y = y;
  this.width = brickWidth;
  this.height = brickHeight;
  this.life = 99;
  this.type = type;

  switch (this.type) {
    case "indestructible":
      this.strikeDamage = 0;
      this.strike = function() {
        this.life -= this.strikeDamage;
      };
      break;
    case "special":
      this.strikeDamage = 99;
      this.strike = function() {
        this.life -= this.strikeDamage;
        balls.push(new Ball(this.x, this.y, ball.r, "bonus"));
      };
      break;
    case "rocketBonus":
      this.strikeDamage = 33;
      this.strike = function() {
        this.life -= this.strikeDamage;
        if (this.life === 0) {
          bonusRockets.push(new BonusRocket(this.x, this.y));
        }
      };
      break;
    default:
      this.strikeDamage = 33;
      this.strike = function(ballDx) {
        this.life -= this.strikeDamage;
        if (this.life === 0) {
          brokenBricks.push(new BrokenBrick(this.x, this.y, ballDx));
        }
      };
  }

  this.draw = function() {
    stroke(0);
    strokeWeight(0);
    fill(0, 0, 0, shadow.opacity);
    rect(
      this.x + shadow.offset,
      this.y + shadow.offset,
      this.width,
      this.height
    );
    if (this.type === "indestructible") {
      fill(96, 94, 94);
    } else if (this.type === "special") {
      fill(0);
      ellipse(
        this.x + brickWidth / 2,
        this.y + brickHeight - ball.r / 2,
        ball.r,
        ball.r
      );
      fill(255, 50, 100, 200);
    } else if (this.type === "rocketBonus") {
      fill(80);
      stroke(0);
      strokeWeight(2);
      triangle(
        this.x - 5 + brickWidth / 2,
        this.y + 28,
        this.x + 5 + brickWidth / 2,
        this.y + 28,
        this.x + brickWidth / 2,
        this.y + 16
      );
      ellipse(this.x + brickWidth / 2, this.y + 13, 10, 20);
      fill(77, 112, 168, 255 * (this.life / 100));
    } else {
      fill(77, 112, 168, 255 * (this.life / 100));
    }
    stroke(50);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.height);
    if (bounceCount > maxBounce) {
      this.y += 0.07;
      if (this.y > 300) {
        this.y += 10;
      }
    }
  };
}

function Pointer() {
  this.x1 = W / 2;
  this.y1 = H - ball.r;
  this.x2 = W / 2;
  this.y2 = H - 70;
  this.sensitivity = 20;

  this.draw = function() {
    strokeWeight(1);
    stroke(255, 100, 100);
    fill(0);
    line(this.x1, this.y1, this.x2, this.y2);
  };

  this.aim = function(right) {
    this.x2 += right ? this.sensitivity : -this.sensitivity;
  };
}

function ScoreBall() {
  this.d = 15;

  this.draw = function(x, y) {
    this.x = x;
    this.y = y;
    strokeWeight(1);
    stroke(0);
    fill(255);
    ellipse(this.x, this.y, this.d, this.d);
  };
}

function Clouds(x, y, d, d2) {
  this.x = x;
  this.y = y;
  this.d = d;
  this.d2 = d2;

  this.draw = function() {
    if (this.x > W + 135) {
      this.x = -150;
      this.y = Math.random() * (H / 2) + 100;
    }
    this.x += 0.5;
    fill(222, 229, 229);
    strokeWeight(0);
    ellipse(this.x, this.y, this.d, this.d2);
    ellipse(this.x + 30, this.y - 20, this.d * 2, this.d2);
    ellipse(this.x - 30, this.y - 30, this.d * 2.5, this.d2);
    ellipse(this.x, this.y - 50, this.d, this.d2);
    ellipse(this.x - 30, this.y + 10, this.d, this.d2 / 2);
  };
}

function Rocket(x) {
  this.y = H;
  this.x = x;

  this.draw = function() {
    fill(80);
    stroke(0);
    strokeWeight(2);
    triangle(
      this.x - 5,
      this.y + 20,
      this.x + 5,
      this.y + 20,
      this.x,
      this.y + 3
    );
    ellipse(this.x, this.y, 10, 24);

    this.y -= 4;
  };
  this.update = function(brickX, brickY, brickWidth, brickHeight) {
    if (
      this.x > brickX &&
      this.x < brickX + brickWidth &&
      this.y < brickY + brickHeight &&
      this.y > brickY
    ) {
      return true;
    }
  };
}

function BonusRocket(brickX, brickY) {
  this.x = brickX;
  this.y = brickY;
  this.width = brickWidth;
  this.dy = -4;
  this.acceleration = 0.2;
  this.posX = this.x - 5 + brickWidth / 2;

  this.draw = function() {
    fill(80);
    stroke(0);
    strokeWeight(2);
    triangle(
      this.x - 5 + brickWidth / 2,
      this.y + 30,
      this.x + 5 + brickWidth / 2,
      this.y + 30,
      this.x + brickWidth / 2,
      this.y + 18
    );
    ellipse(this.x + brickWidth / 2, this.y + 15, 10, 20);
  };

  this.update = function(batX1, batX2, batY) {
    this.dy += this.acceleration;
    this.y += this.dy;
    if (this.posX > batX1 && this.posX < batX2 && this.y > batY - 25) {
      bonusRockets.pop();
      rocketsAmmo++;
      updateRocketCounter();
      bat.highlight();
    } else if (this.y > H) {
      bonusRockets.pop();
    }
  };
}

function Mountain(x1, y1, x2, y2, x3, y3) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.x3 = x3;
  this.y3 = y3;
  this.dx = 0;

  this.draw = function() {
    strokeWeight(1);
    stroke(185, 198, 220);
    fill(185, 208, 230);
    triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
  };

  this.update = function(dx) {
    this.dx = dx;
    this.x1 += this.dx;
    this.x2 += this.dx;
    this.x3 += this.dx;
  };
}

function BrokenBrick(x, y, ballDx) {
  this.x = x;
  this.y = y;
  this.dy = -4;
  this.dx = ballDx * 0.4;
  this.dy += this.acceleration = 0.3;
  this.width = brickWidth - 10;
  this.height = brickHeight - 7;

  this.draw = function() {
    strokeWeight(1);
    stroke(50, 50, 50, 100);
    fill(89, 65, 169, 30);

    rect(this.x + 10, this.y, this.width, this.height);
  };

  this.update = function() {
    this.x += this.dx;
    this.dy += this.acceleration;
    this.width -= this.acceleration;
    this.height -= this.acceleration;
    this.y += this.dy;
  };
}
