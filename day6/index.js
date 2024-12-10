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
    Array.from({ length: lines[0].length }, () => "")
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

  function getNextValidPosition(r, c, dirInd, obstaclePos) {
    let newR, newC;

    do {
      newR = r + dirs[dirInd][0];
      newC = c + dirs[dirInd][1];

      if (outOfBoundary(newR, newC)) {
        return false;
      } else {
        if (
          lines[newR][newC] === "#" ||
          (obstaclePos && newR === obstaclePos.r && newC === obstaclePos.c)
        ) {
          dirInd = getNextDir(dirInd);
        } else {
          r = newR;
          c = newC;
        }
      }
    } while (
      lines[newR][newC] === "#" ||
      (obstaclePos && newR === obstaclePos.r && newC === obstaclePos.c)
    );

    return {
      r,
      c,
      dirInd,
    };
  }

  let r = row;
  let c = col;
  let dirInd = 0;

  outer: while (true) {
    if (visited[r][c] === "") {
      visited[r][c] = dirInd;
    }

    const result = getNextValidPosition(r, c, dirInd);

    if (!result) break;

    const { r: newR, c: newC, dirInd: nextDirInd } = result;
    dirInd = nextDirInd;

    if (visited[newR][newC] === "" && lines[newR][newC] !== "^") {
      // check for loop if turn right
      const result = getNextValidPosition(r, c, dirInd, {
        r: newR,
        c: newC,
      });

      if (!result) continue;

      let { r: r2, c: c2, dirInd: dirInd2 } = result;

      const visited2 = [...visited.map((item) => [...item])];

      inner: while (true) {
        if (visited2[r2][c2] === "") {
          visited2[r2][c2] = dirInd2;
        } else if (dirInd2 === visited2[r2][c2]) {
          countLoops++;
          break inner;
        }

        const result = getNextValidPosition(r2, c2, dirInd2, {
          r: newR,
          c: newC,
        });
        if (!result) {
          break inner;
        } else {
          r2 = result.r;
          c2 = result.c;
          dirInd2 = result.dirInd;
        }
      }
    }

    r = newR;
    c = newC;
  }

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
