const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = getScores(data);
    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function getScores(data) {
  const lines = data.split("\n");

  const dirs = [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
  ];

  const scoresArr = [];

  function outOfBoundary(r, c) {
    if (r >= lines.length || r < 0) {
      return true;
    }
    if (c >= lines[r].length || c < 0) {
      return true;
    }
  }

  function findPath(r, c, path, scores) {
    if (outOfBoundary(r, c)) {
      return;
    }
    if (lines[r][c] == path) {
      if (path == 9) {
        scores.add(`${r}-${c}`);
      } else {
        for (let dir of dirs) {
          const nR = r + dir[0];
          const nC = c + dir[1];
          findPath(nR, nC, Number(path) + 1, scores);
        }
      }
    }
  }

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      if (lines[row][col] === "0") {
        const scores = new Set();
        findPath(row, col, 0, scores);
        scoresArr.push(scores.size);
      }
    }
  }

  return scoresArr.reduce((a, c) => a + c, 0);
}

const testInput = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

console.log(getScores(testInput));
