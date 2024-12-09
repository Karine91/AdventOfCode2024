const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = countLoopPositions(data);
    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function countGuardPositions(data) {
  const start = data.indexOf("^");
  const lines = data.split("\n");

  let col = start % (lines[0].length + 1);
  let row = Math.floor(start / (lines[0].length + 1));
  let count = 0;

  const visited = Array.from({ length: lines.length }, () =>
    Array.from({ length: lines[0].length })
  );

  const dirs = [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
  ];

  function getNextDir(curDirInd) {
    return (curDirInd + 1) % dirs.length;
  }

  function outOfBoundary(r, c) {
    if (r >= lines.length || r < 0) {
      return true;
    }
    if (c >= lines[r].length || c < 0) {
      return true;
    }
  }

  function go(r, c, dirInd) {
    if (!visited[r][c]) {
      count++;
      visited[r][c] = true;
    }

    let newR, newC;
    do {
      newR = r + dirs[dirInd][0];
      newC = c + dirs[dirInd][1];
      if (outOfBoundary(newR, newC)) {
        return;
      } else {
        if (lines[newR][newC] === "#") {
          dirInd = getNextDir(dirInd);
        } else {
          go(newR, newC, dirInd);
        }
      }
    } while (lines[newR][newC] === "#");
  }

  go(row, col, 0);

  return count;
}

function countLoopPositions(data) {
  const start = data.indexOf("^");
  const lines = data.split("\n");

  let col = start % (lines[0].length + 1);
  let row = Math.floor(start / (lines[0].length + 1));
  let countLoops = 0;

  const visited = Array.from({ length: lines.length }, () =>
    Array.from({ length: lines[0].length })
  );

  const dirs = [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
  ];

  function getNextDir(curDirInd) {
    return (curDirInd + 1) % dirs.length;
  }

  function outOfBoundary(r, c) {
    if (r >= lines.length || r < 0) {
      return true;
    }
    if (c >= lines[r].length || c < 0) {
      return true;
    }
  }

  function go(r, c, dirInd, main, turnPoint) {
    if (main && visited[r][c] == undefined) {
      visited[r][c] = dirInd;
    } else if (!main && dirInd === visited[r][c]) {
      console.log(turnPoint);
      countLoops++;
      return;
    }
    let newR, newC;

    do {
      newR = r + dirs[dirInd][0];
      newC = c + dirs[dirInd][1];

      if (outOfBoundary(newR, newC)) {
        return;
      } else {
        if (lines[newR][newC] === "#") {
          dirInd = getNextDir(dirInd);
        } else {
          if (main && lines[newR][newC] !== "^") {
            go(r, c, getNextDir(dirInd), false, [r, c]);
          }
          go(newR, newC, dirInd, main, turnPoint);
        }
      }
    } while (lines[newR][newC] === "#");
  }

  go(row, col, 0, true);

  return countLoops;
}

const testInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

console.log(countLoopPositions(testInput));
