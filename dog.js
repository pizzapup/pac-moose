let dogSpriteNormal;
let ghostSprite;
let dogSpriteChomp;
let dogSprite;
let isMoving = false;
let dogX = 200;
let dogY = 200;
let dogSpeed = 3;

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
  createCanvas(400, 400);

  dogSprite = dogSpriteNormal;
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
export {
  dogSpriteNormal,
  ghostSprite,
  dogSpriteChomp,
  dogSprite,
  isMoving,
  dogX,
  dogY,
  dogSpeed,
  movement,
  handleMovement,
  keyPressed,
  keyReleased,
  draw,
  moveRight,
  moveLeft,
  moveDown,
  moveUp,
};
