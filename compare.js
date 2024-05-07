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
function powerPelletCollision() {
  for (let pellet of powerPellets) {
    let d = dist(
      dogX + dogSize / 2,
      dogY + dogSize / 2,
      pellet[1] * tileSize + tileSize / 2,
      pellet[0] * tileSize + tileSize / 2
    );
    if (d < dogSize / 2) {
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

// Code that is more concise, uses ES6+ features, and is more organized and clean:
// - identify repeated code and create a function to handle it
// - use array methods to loop through arrays
// - use object destructuring to access object properties
// - use classes to create objects
// - separate concerns and keep related things together
// - use the most concise and short code possible

// Collision Detection
// collision detection is used multiple times to check if the dog, fries, power pellets, or ghosts collide with each other or with walls in the maze. because this logic is repeated, we can create a function to handle it and make the code more organized and concise. the function will be able to be used for all types of collisions by passing in the necessary parameters. this will help to keep the code clean and avoid repetition.

// COLLISION DETECTION
// check if two objects collide
function checkCollision(obj1, obj2) {
  let overlap = 0; // overlap value to prevent objects from getting stuck in walls

  if (obj1.x < 0) {
    obj1.x = width - obj1.size;
  } else if (obj1.x > width - obj1.size) {
    obj1.x = 0;
  }
  if (obj1.y < 0) {
    obj1.y = height - obj1.size;
  }
  if (obj1.y > height - obj1.size) {
    obj1.y = 0;
  }

  let obj1Left = obj1.x;
  let obj1Right = obj1.x + obj1.size;
  let obj1Top = obj1.y;
  let obj1Bottom = obj1.y + obj1.size;

  let obj2Left = obj2.x;
  let obj2Right = obj2.x + obj2.size;
  let obj2Top = obj2.y;
  let obj2Bottom = obj2.y + obj2.size;

  if (
    obj1Right > obj2Left &&
    obj1Left < obj2Right &&
    obj1Bottom > obj2Top &&
    obj1Top < obj2Bottom
  ) {
    return true;
  }

  return false;
}
