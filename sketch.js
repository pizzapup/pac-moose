let dogSpriteNormal;
let dogSpriteChomp;
let dogSprite;
let isMoving = false;
let isEating = false;
let lives = 3;
let dogSpeed = 3;
let score = 0;
let red = [255, 0, 0];
let yellow = [255, 255, 0];
let green = [0, 255, 0];
let pink = [255, 0, 255];

let maze = [
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 3, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [2, 0, 1, 0, 0, 0, 0, 0, 1, 0, 2],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 3, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
];
// Index of "4"s in the maze array: [1, 9], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [7, 7]
let powerPellets = [
  [1, 7],
  [1, 6],
  [1, 9],
  [3, 3],
  [5, 3],
  [5, 4],
  [5, 5],
  [5, 6],
  [5, 7],
  [7, 7],
  [9, 1],
];
let fries = [];
let mazeColor = [50, 50, 200];
let fryColor = [255, 255, 0];

const canvasSize = 496;

let dogX = 100;
let dogY = 50;
const dogSize = 37.5;

const tileSize = 45;
const frySizeX = 15;
const frySizeY = 7.5;

let movement = {
  left: false,
  right: false,
  up: false,
  down: false,
};
let ghostSpriteElla;
let ghostSpriteSteven;
let ghosts = [
  {x: 0, y: 0, speedX: 1, speedY: 0},
  {x: 0, y: 0, speedX: 0, speedY: 1},
];

function preload() {
  dogSpriteNormal = loadImage("assets/moose-normal.png");
  dogSpriteChomp = loadImage("assets/moose-chomp.png");
  ghostSpriteElla = loadImage("assets/ghost/el.png");
  ghostSpriteSteven = loadImage("assets/ghost/steve.png");
  ghostSpriteRed = loadImage("assets/ghost/red.png");
  ghostSpriteBlue = loadImage("assets/ghost/blue.png");
  ghostSpriteBlue2 = loadImage("assets/ghost/blue2.png");

  friesSprite = loadImage("assets/ghost/fries.png");

  ghosts[0].sprite = ghostSpriteElla;
  ghosts[1].sprite = ghostSpriteSteven;
}
let steve = ghosts[1];
let ella = ghosts[0];

function setup() {
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent("canvas-container");
  // addButtons();
  generateFries();
  print(canvasSize);
  dogSprite = dogSpriteNormal;
  initializeGhosts();
}
function addButtons() {
  let buttonSize = 50;
  let buttonPadding = 10;

  let buttonRight = createButton("Right");
  buttonRight.position(
    canvasSize - buttonSize - buttonPadding,
    canvasSize - buttonSize - buttonPadding
  );
  buttonRight.size(buttonSize, buttonSize);
  buttonRight.mousePressed(() => handleButtonMovement("right", true));
  buttonRight.mouseReleased(() => handleButtonMovement("right", false));

  let buttonLeft = createButton("Left");
  buttonLeft.position(
    canvasSize - buttonSize * 2 - buttonPadding * 2,
    canvasSize - buttonSize - buttonPadding
  );
  buttonLeft.size(buttonSize, buttonSize);
  buttonLeft.mousePressed(() => handleButtonMovement("left", true));
  buttonLeft.mouseReleased(() => handleButtonMovement("left", false));

  let buttonUp = createButton("Up");
  buttonUp.position(
    canvasSize - buttonSize - buttonPadding,
    canvasSize - buttonSize * 2 - buttonPadding * 2
  );

  buttonUp.size(buttonSize, buttonSize);
  buttonUp.mousePressed(() => handleButtonMovement("up", true));
  buttonUp.mouseReleased(() => handleButtonMovement("up", false));

  let buttonDown = createButton("Down");
  buttonDown.position(
    canvasSize - buttonSize - buttonPadding,
    canvasSize - buttonSize * 3 - buttonPadding * 3
  );

  buttonDown.size(buttonSize, buttonSize);
  buttonDown.mousePressed(() => handleButtonMovement("down", true));
  buttonDown.mouseReleased(() => handleButtonMovement("down", false));
}
function generateFries() {
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 0) {
        let position = createVector(
          j * tileSize + tileSize / 2,
          i * tileSize + tileSize / 2
        );
        let angle = random(TWO_PI);
        fries.push({position, angle});
      }
    }
  }
}

function moveGhost(ghost) {
  ghost.x += ghost.speedX;
  ghost.y += ghost.speedY;
  checkGhostCollision();

  image(ghost.sprite, ghost.x, ghost.y, tileSize, tileSize);
}

function initializeGhosts() {
  for (let ghost of ghosts) {
    let x, y;
    do {
      x = Math.floor(Math.random() * maze[0].length);
      y = Math.floor(Math.random() * maze.length);
    } while (maze[y][x] !== 0);

    ghost.x = x * tileSize;
    ghost.y = y * tileSize;
  }
}

function checkGhostCollision() {
  let directions = [
    {speedX: 1, speedY: 0},
    {speedX: 0, speedY: 1},
    {speedX: -1, speedY: 0},
    {speedX: 0, speedY: -1},
  ];

  for (let ghost of ghosts) {
    let ghostLeft = ghost.x;
    let ghostRight = ghost.x + tileSize;
    let ghostTop = ghost.y;
    let ghostBottom = ghost.y + tileSize;
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        if (maze[i][j] === 1 || maze[i][j] === 2) {
          let wallLeft = j * tileSize;
          let wallRight = (j + 1) * tileSize;
          let wallTop = i * tileSize;
          let wallBottom = (i + 1) * tileSize;
          if (
            ghostRight > wallLeft &&
            ghostLeft < wallRight &&
            ghostBottom > wallTop &&
            ghostTop < wallBottom
          ) {
            if (ghost.speedX > 0) {
              ghost.x = wallLeft - tileSize;
            } else if (ghost.speedX < 0) {
              ghost.x = wallRight;
            }
            if (ghost.speedY > 0) {
              ghost.y = wallTop - tileSize;
            } else if (ghost.speedY < 0) {
              ghost.y = wallBottom;
            }

            let direction = random(directions);
            ghost.speedX = direction.speedX;
            ghost.speedY = direction.speedY;
          }
        }
      }
    }
  }
}
function handleButtonMovement(direction, isPressed) {
  isMoving = isPressed;
  for (let direction in movement) {
    movement[direction] = false;
  }
  movement[direction] = isPressed;
}
function handleMovement(keyCode, isPressed) {
  const directionMap = {
    [RIGHT_ARROW]: "right",
    [LEFT_ARROW]: "left",
    [DOWN_ARROW]: "down",
    [UP_ARROW]: "up",
  };

  if (keyCode in directionMap) {
    isMoving = isPressed;
    for (let direction in movement) {
      movement[direction] = false;
    }
    movement[directionMap[keyCode]] = isPressed;
  }
}
function drawPowerPellets() {
  for (let pellet of powerPellets) {
    // display fries instead of power pellets
    image(
      friesSprite,
      pellet[1] * tileSize,
      pellet[0] * tileSize,
      tileSize,
      tileSize
    );
  }
}
let isPowerUp = false;
function powerPelletCollision() {
  for (let pellet of powerPellets) {
    let d = dist(
      // distance between dog and pellet
      dogX + dogSize / 2, // x position of dog
      dogY + dogSize / 2, // y position of dog
      pellet[1] * tileSize + tileSize / 2, // x position of pellet
      pellet[0] * tileSize + tileSize / 2 // y position of pellet
    );
    if (d < dogSize / 2) {
      // if dog is touching pellet (distance is less than dog size)
      score += 5;
      powerPellets.splice(powerPellets.indexOf(pellet), 1);
    }
    // redraw power pellets
    drawPowerPellets();
    isPowerUp = true;
    setTimeout(() => {
      isPowerUp = false;
    }, 5000);
  }
}

function draw() {
  background(0);

  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      fill(0);
      stroke(0);
      if (maze[i][j] === 1) {
        fill(mazeColor);
        stroke("#fff");
        stroke(1);
        rect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if (maze[i][j] === 2) {
        fill(red);
        rect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if (maze[i][j] === 4) {
        fill(yellow);
        rect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if (maze[i][j] === 0) {
        fill(0);
        stroke(green);
        rect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if (maze[i][j] === 3) {
        fill(pink);
        rect(j * tileSize, i * tileSize, tileSize, tileSize);
      }
    }
  }
  for (let ghost of ghosts) {
    moveGhost(ghost);
  }
  handleGhostFriesCollision();
  checkFryCollision();
  powerPelletCollision();
  drawFries();
  drawPowerPellets();

  if (isEating) {
    dogSprite = dogSpriteChomp;
    setTimeout(() => {
      dogSprite = dogSpriteNormal;
    }, 800);
  }

  if (isMoving) {
    if (movement.right) {
      moveRight();
    } else if (movement.left) {
      moveLeft();
    } else if (movement.down) {
      moveDown();
    } else if (movement.up) {
      moveUp();
    }
    checkCollision();
  } else {
    image(dogSprite, dogX, dogY, dogSize, dogSize);
  }
  displayScore();
}
let isBlue = false;
function handleGhostFriesCollision() {
  for (let ghost of ghosts) {
    let d = dist(
      dogX + dogSize / 2,
      dogY + dogSize / 2,
      ghost.x + tileSize / 2,
      ghost.y + tileSize / 2
    );
    if (d < dogSize / 2) {
      if (ghost.sprite === ghostSpriteElla) {
        score += 2;
        steve.sprite = ghostSpriteBlue;
        setTimeout(() => {
          steve.sprite = ghostSpriteSteven;
        }, 5000);
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            ella.sprite = friesSprite;
          }, i * 300);
          setTimeout(() => {
            ella.sprite = ghostSpriteElla;
          }, i * 500 + 250);
        }
        // turn ghostSpriteSteven into ghostSpriteRed for 2seconds
      }
      if (ghost.sprite === ghostSpriteSteven) {
        score -= 1;
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            steve.sprite = ghostSpriteRed;
          }, i * 300);
          setTimeout(() => {
            steve.sprite = ghostSpriteSteven;
          }, i * 500 + 250);
        }
      }
      if (ghost.sprite === ghostSpriteBlue) {
        score += 20;
        // blink ghostSpriteBlue for 5 seconds
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            steve.sprite = ghostSpriteBlue;
          }, i * 300);
          setTimeout(() => {
            steve.sprite = ghostSpriteBlue2;
          }, i * 500 + 250);
        }

        ghost.x = -100;
        ghost.y = -100;
        setTimeout(() => {
          let x, y;
          do {
            x = Math.floor(Math.random() * maze[0].length);
            y = Math.floor(Math.random() * maze.length);
          } while (maze[y][x] !== 0);

          ghost.x = x * tileSize;
          ghost.y = y * tileSize;
        }, 5000);
      }
    }
  }
}
function setScore() {
  if (score < 0) {
    score = 0;
  }
}

function drawFries() {
  setScore();
  fill(fryColor);
  for (let pellet of fries) {
    push();
    translate(pellet.position.x, pellet.position.y);
    rotate(pellet.angle);
    rect(0, 0, 10, 2);
    pop();
  }
}
function checkFryCollision() {
  for (let i = fries.length - 1; i >= 0; i--) {
    let fry = fries[i];
    let d = dist(
      dogX + dogSize / 2,
      dogY + dogSize / 2,
      fry.position.x,
      fry.position.y
    );
    if (d < dogSize / 2) {
      fries.splice(i, 1);
      score++;
      isEating = true;
      setTimeout(() => {
        isEating = false;
      }, 500);
    }
  }
}
function displayScore() {
  fill(255);
  textSize(20);
  textAlign(RIGHT);
  text("Score: " + score, width - 20, 30);
}
function keyPressed() {
  handleMovement(keyCode, true);
}
function keyReleased() {
  handleMovement(keyCode, false);
}

function checkCollision() {
  let overlap = 0;

  if (dogX < 0) {
    dogX = width - dogSize;
  } else if (dogX > width - dogSize) {
    dogX = 0;
  }
  if (dogY < 0) {
    dogY = height - dogSize;
  }
  if (dogY > height - dogSize) {
    dogY = 0;
  }

  let dogLeft = dogX;
  let dogRight = dogX + dogSize;
  let dogTop = dogY;
  let dogBottom = dogY + dogSize;
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 1) {
        let wallLeft = j * tileSize + overlap;
        let wallRight = (j + 1) * tileSize - overlap;
        let wallTop = i * tileSize + overlap;
        let wallBottom = (i + 1) * tileSize - overlap;

        if (
          dogRight > wallLeft &&
          dogLeft < wallRight &&
          dogBottom > wallTop &&
          dogTop < wallBottom
        ) {
          if (movement.right) {
            dogX = wallLeft - dogSize;
          } else if (movement.left) {
            dogX = wallRight;
          }
          if (movement.down) {
            dogY = wallTop - dogSize;
          } else if (movement.up) {
            dogY = wallBottom;
          }
        }
      }
    }
  }
}

function moveRight() {
  dogX += dogSpeed;
  push();
  translate(dogX + dogSize / 2, dogY + dogSize / 2);
  scale(-1, 1);
  image(dogSprite, -dogSize / 2, -dogSize / 2, dogSize, dogSize);
  pop();
}

function moveLeft() {
  dogX -= dogSpeed;
  push();
  translate(dogX + dogSize / 2, dogY + dogSize / 2);
  image(dogSprite, -dogSize / 2, -dogSize / 2, dogSize, dogSize);
  pop();
}

function moveDown() {
  dogY += dogSpeed;
  push();
  translate(dogX + dogSize / 2, dogY + dogSize / 2);
  rotate(HALF_PI);
  image(dogSprite, -dogSize / 2, -dogSize / 2, dogSize, dogSize);
  pop();
}

function moveUp() {
  dogY -= dogSpeed;
  push();
  translate(dogX + dogSize / 2, dogY + dogSize / 2);
  scale(-1, 1);
  rotate(HALF_PI);
  image(dogSprite, -dogSize / 2, -dogSize / 2, dogSize, dogSize);
  pop();
}

// REWRITE CODE USING BEST CODING PRACTICES, NEWEST TECHNIQUES, DRY PRINCIPLES, THE MOST CONCISE AND SHORT CODE POSSIBLE (UTILIZE ES6+ FEATURES, SYNTAX, AND THINGS LIKE ARRAY METHODS, OBJECT DESTRUCTURING, CLASSES, ETC. - KEEP THINGS CLEAN AND ORGANIZED - keep related things together, separate concerns, etc.)
