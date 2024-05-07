// REWRITING CODE USING BEST CODING PRACTICES, NEWEST TECHNIQUES, DRY PRINCIPLES, THE MOST CONCISE AND SHORT CODE POSSIBLE (UTILIZE ES6+ FEATURES, SYNTAX, AND THINGS LIKE ARRAY METHODS, OBJECT DESTRUCTURING, CLASSES, ETC. - KEEP THINGS CLEAN AND ORGANIZED - keep related things together, separate concerns, etc.)

// Game components (setup)

// Maze & Canvas
// maze = [
//   [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
//   [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
//   [1, 0, 0, 3, 1, 0, 0, 0, 0, 0, 1],
//   [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
//   [2, 0, 1, 0, 0, 0, 0, 0, 1, 0, 2],
//   [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
//   [1, 0, 0, 0, 1, 0, 1, 3, 0, 0, 1],
//   [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
// ];
// mazeColor = [50, 50, 200];
// Setup:
//   let canvas = createCanvas(canvasSize, canvasSize);
//   canvas.parent("canvas-container");
// Draw:
//   for (let i = 0; i < maze.length; i++) {
//     for (let j = 0; j < maze[i].length; j++) {
//       fill(0);
//       stroke(0);
//       if (maze[i][j] === 1) {
//         fill(mazeColor);
//         stroke("#fff");
//         stroke(1);
//         rect(j * tileSize, i * tileSize, tileSize, tileSize);
//       } else if (maze[i][j] === 2) {
//         fill(red);
//         rect(j * tileSize, i * tileSize, tileSize, tileSize);
//       } else if (maze[i][j] === 4) {
//         fill(yellow);
//         rect(j * tileSize, i * tileSize, tileSize, tileSize);
//       } else if (maze[i][j] === 0) {
//         fill(0);
//         stroke(green);
//         rect(j * tileSize, i * tileSize, tileSize, tileSize);
//       } else if (maze[i][j] === 3) {
//         fill(pink);
//         rect(j * tileSize, i * tileSize, tileSize, tileSize);
//       }
//     }
//   }
