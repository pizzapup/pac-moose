let dogSpriteNormal;
let ghostSprite;
let dogSpriteChomp;
let dogSprite;
let isMoving = false;
let dogX = 200;
let dogY = 200;
let dogSpeed = 3;
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const tileSize = 40;
const dogSize = 20;
let canvasSize = 600;

// Object to store movement state for each direction
let movement = {
  left: false,
  right: false,
  up: false,
  down: false,
};

// Load dog sprites
function preload() {
  dogSpriteNormal = loadImage("assets/moose-normal.png");
  dogSpriteChomp = loadImage("assets/moose-chomp.png");
  ghostSprite = loadImage("assets/moose-chomp.png");
}

function setup() {
  createCanvas(canvasSize, canvasSize);

  dogSprite = dogSpriteNormal;
  dogX = width / 2;
  dogY = height / 2;
}

// Handle arrow key presses

function handleMovement(keyCode, isPressed) {
  // Map arrow key codes to movement directions
  const directionMap = {
    [RIGHT_ARROW]: "right",
    [LEFT_ARROW]: "left",
    [DOWN_ARROW]: "down",
    [UP_ARROW]: "up",
  };

  // dog can only move in one direction at a time
  // so if the key is pressed, set all other directions to false
  if (keyCode in directionMap) {
    isMoving = isPressed;
    for (let direction in movement) {
      movement[direction] = false;
    }
    movement[directionMap[keyCode]] = isPressed;
  }
}

function keyPressed() {
  handleMovement(keyCode, true);
}

function keyReleased() {
  handleMovement(keyCode, false);
}

function draw() {
  background(0);

  // Draw the maze
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 1) {
        fill(0);
        rect(j * tileSize, i * tileSize, tileSize, tileSize);
      }
    }
  }

  // Adjust dog position based on movement state
  if (movement.right) {
    moveRight();
  }
  if (movement.left) {
    moveLeft();
  }
  if (movement.down) {
    moveDown();
  }
  if (movement.up) {
    moveUp();
  }

  // Draw dog sprite if not moving
  if (!isMoving) {
    dogSprite = dogSpriteNormal;
    image(dogSprite, dogX, dogY, 30, 30);
  }

  // if dog is chomping switch to chomp sprite
  if (frameCount % 25 === 0 && isMoving) {
    dogSprite =
      dogSprite === dogSpriteNormal ? dogSpriteChomp : dogSpriteNormal;
  }
}
function moveRight() {
  dogX += dogSpeed;
  push();
  translate(dogX + 30, dogY);
  scale(-1, 1); // Flip horizontally
  image(dogSprite, 0, 0, 30, 30); // Draw dog facing left
  pop();
}
function moveLeft() {
  dogX -= dogSpeed;
  image(dogSprite, dogX, dogY, 30, 30); // Draw dog facing right
}
function moveDown() {
  dogY += dogSpeed;
  push();
  translate(dogX, dogY + 30);
  rotate(-HALF_PI); // Rotate 90 degrees counterclockwise
  image(dogSprite, 0, 0, 30, 30); // Draw dog facing up
  pop();
}
function moveUp() {
  dogY -= dogSpeed;
  push();
  translate(dogX + 30, dogY);
  scale(-1, 1); // Flip horizontally
  image(dogSprite, 0, 0, 30, 30); // Draw dog facing left
  pop();
}
