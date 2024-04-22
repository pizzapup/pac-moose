let dogSpriteNormal;
let dogSpriteChomp;
let dogSprite;
let isMoving = false;
let isEating = false; // Flag to indicate whether the dog is currently eating
let lives = 3;
let dogSpeed = 3;
let score = 0;
let maze = [
  [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [2, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 2],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
  [2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2],
  [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
];
let fries = [];

let baseFrySizeX = 15;
let baseFrySizeY = 3;
let fryColor = [255, 255, 0];
let mazeColor = [50, 50, 200];

let dogX = 100;
let dogY = 50;
let scaleFactor = 1.0; // Adjust this value to scale all elements uniformly

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
// Object to store movement state for each direction
let movement = {
  left: false,
  right: false,
  up: false,
  down: false,
};
let ghostSpriteOrange;
let ghostSpriteBlue;
let ghosts = [
  {x: 0, y: 0, speedX: 1, speedY: 0},
  {x: 0, y: 0, speedX: 0, speedY: 1},
];

function preload() {
  dogSpriteNormal = loadImage("assets/moose-normal.png");
  dogSpriteChomp = loadImage("assets/moose-chomp.png");
  ghostSpriteOrange = loadImage("assets/ghost/el.png");
  ghostSpriteBlue = loadImage("assets/ghost/steve.png");

  friesSprite = loadImage("assets/ghost/fries.png");

  ghosts[0].sprite = ghostSpriteOrange;
  ghosts[1].sprite = ghostSpriteBlue;
}

function setup() {
  createCanvas(canvasSize, canvasSize);
  // Add pellets to the maze
  generateFries();
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
        let angle = random(TWO_PI); // Generate a random angle
        fries.push({position, angle}); // Add pellet position and angle to array
      }
    }
  }
}

// move ghosts
function moveGhost(ghost) {
  // Move the ghost
  ghost.x += ghost.speedX;
  ghost.y += ghost.speedY;
  checkGhostCollision();
  // Draw the ghost
  image(ghost.sprite, ghost.x, ghost.y, tileSize, tileSize);
}

function initializeGhosts() {
  for (let ghost of ghosts) {
    // Randomly select a position until we find an empty tile
    let x, y;
    do {
      x = Math.floor(Math.random() * maze[0].length);
      y = Math.floor(Math.random() * maze.length);
    } while (maze[y][x] !== 0); // Repeat until an empty tile is found

    // Set the ghost's position
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
  // Check if the ghost collides with a wall or Canvas edge
  // make sure ghosts move direction instead of wrap around canvas like dog does when it reaches edge

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
            // Collision detected
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
            // Randomly change the ghost's direction

            let direction = random(directions);
            ghost.speedX = direction.speedX;
            ghost.speedY = direction.speedY;
          }
        }
      }
    }
  }
}
function handleMovement(keyCode, isPressed) {
  // Map arrow key codes to movement directions
  const directionMap = {
    [RIGHT_ARROW]: "right",
    [LEFT_ARROW]: "left",
    [DOWN_ARROW]: "down",
    [UP_ARROW]: "up",
  };

  // dog can only move in one direction at a time
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
  // Draw the maze
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 1) {
        // Wall
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
  // dog chomp when eating fry but then immediately return to normal
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

function handleGhostFriesCollision() {
  for (let ghost of ghosts) {
    let d = dist(
      dogX + dogSize / 2,
      dogY + dogSize / 2,
      ghost.x + tileSize / 2,
      ghost.y + tileSize / 2
    );
    if (d < dogSize / 2) {
      if (ghost.sprite === ghostSpriteOrange) {
        score += 2;
        // 5 times with 500ms timeout, change the sprite for ghostSpriteOrange to friesSprite and back
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            ghost.sprite = friesSprite;
          }, i * 300);
          setTimeout(() => {
            ghost.sprite = ghostSpriteOrange;
          }, i * 500 + 250);
        }
      }
      if (ghost.sprite === ghostSpriteBlue) {
        score -= 1;
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
  fill(fryColor); // Yellow color
  for (let pellet of fries) {
    push();
    translate(pellet.position.x, pellet.position.y); // Move origin to pellet position
    rotate(pellet.angle); // Rotate to the specified angle
    rect(0, 0, 10, 2); // Draw pellet at the rotated position
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
      // Dog has collided with a fry
      fries.splice(i, 1); // Remove fry from array
      score++; // Increment score
      isEating = true; // Set the eating flag to true
      setTimeout(() => {
        isEating = false;
      }, 500); // Reset eating flag after 500 milliseconds
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
  let overlap = 5; // Amount of overlap to prevent tunneling
  // if the dog reaches the edge of the canvas, wrap around to the other side
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

  // Check if the dog collides with a wall
  let dogLeft = dogX;
  let dogRight = dogX + dogSize;
  let dogTop = dogY;
  let dogBottom = dogY + dogSize;
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 1) {
        // Calculate the bounds of the wall but allow for some padding
        let wallLeft = j * tileSize + overlap;
        let wallRight = (j + 1) * tileSize - overlap;
        let wallTop = i * tileSize + overlap;
        let wallBottom = (i + 1) * tileSize - overlap;

        if (
          dogRight > wallLeft && // Dog is to the right of the wall's left edge
          dogLeft < wallRight && // Dog is to the left of the wall's right edge
          dogBottom > wallTop && // Dog is below the wall's top edge
          dogTop < wallBottom // Dog is above the wall's bottom edge
        ) {
          // Collision detected
          // Adjust the dog's position to prevent overlap
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
  translate(dogX + dogSize / 2, dogY + dogSize / 2); // Translate to the center of the dog
  scale(-1, 1); // Flip horizontally
  image(dogSprite, -dogSize / 2, -dogSize / 2, dogSize, dogSize); // Draw dog facing left
  pop();
}

function moveLeft() {
  dogX -= dogSpeed;
  push();
  translate(dogX + dogSize / 2, dogY + dogSize / 2); // Translate to the center of the dog
  image(dogSprite, -dogSize / 2, -dogSize / 2, dogSize, dogSize); // Draw dog facing right
  pop();
}

function moveDown() {
  dogY += dogSpeed;
  push();
  translate(dogX + dogSize / 2, dogY + dogSize / 2); // Translate to the center of the dog
  rotate(HALF_PI); // Rotate 90 degrees clockwise
  image(dogSprite, -dogSize / 2, -dogSize / 2, dogSize, dogSize); // Draw dog facing up
  pop();
}

function moveUp() {
  dogY -= dogSpeed;
  push();
  translate(dogX + dogSize / 2, dogY + dogSize / 2); // Translate to the center of the dog
  scale(-1, 1); // Flip horizontally
  rotate(HALF_PI); // Rotate 90 degrees clockwise
  image(dogSprite, -dogSize / 2, -dogSize / 2, dogSize, dogSize); // Draw dog facing down
  pop();
}
