const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = getAllXMAS(data);

    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function getAllXMAS(data) {
  const target = "XMAS";

  const lines = data.split("\n");
  const dirs = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
    [-1, -1], // up-left
    [-1, 1], // up-right
    [1, 1], // down-right
    [1, -1], // down-left
  ];

  let count = 0;

  function checkDirection(r, c) {
    if (!(r >= 0 && r < lines.length)) {
      return false;
    }

    if (!(c >= 0 && c < lines[r].length)) {
      return false;
    }

    return true;
  }

  function findXMAS(r, c, patternInd, dir) {
    const val = lines[r][c];
    if (val === target[patternInd]) {
      if (patternInd === target.length - 1) {
        count++;
      } else {
        const newR = r + dir[0];
        const newC = c + dir[1];
        if (checkDirection(newR, newC)) {
          findXMAS(newR, newC, patternInd + 1, dir);
        }
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      for (let dir of dirs) {
        findXMAS(i, j, 0, dir);
      }
    }
  }

  return count;
}

const testInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

console.log(getAllXMAS(testInput));