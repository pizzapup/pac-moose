let dogSpriteNormal;
let dogSpriteChomp;
let dogSprite;
let isMoving = false;
let isEating = false;
let lives = 3;
let dogSpeed = 3;
let score = 0;
let maze = [
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1],
  [2, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 2],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
  [2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
];
let fries = [];

let baseFrySizeX = 15;
let baseFrySizeY = 3;
let fryColor = [255, 255, 0];
let mazeColor = [50, 50, 200];
// let mazeColor = [80, 100, 150];

let dogX = 100;
let dogY = 50;
let scaleFactor = 1.0;

const baseTileSize = 50;
const baseDogSize = 50;
const baseCanvasSize = 650;

const tileSize = baseTileSize * scaleFactor;
const dogSize = baseDogSize * scaleFactor;
const canvasSize = baseCanvasSize * scaleFactor;
const frySizeX = baseFrySizeX * scaleFactor;
const frySizeY = baseFrySizeY * scaleFactor;
let scoreThreshold = 5;
let currentImageIndex = 0;
let images = [];

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
  generateFries();
  print(canvasSize);
  dogSprite = dogSpriteNormal;
  initializeGhosts();
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

function draw() {
  background(0);

  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 1) {
        fill(mazeColor);
        rect(j * tileSize, i * tileSize, tileSize, tileSize);
      }
    }
  }
  for (let ghost of ghosts) {
    moveGhost(ghost);
  }
  handleGhostFriesCollision();
  checkFryCollision();
  drawFries();

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
  let overlap = 5;

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
