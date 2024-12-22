const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = countPrice(data);
    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

const dirs = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

function countPrice(data) {
  const lines = data.split("\n");
  const visited = Array.from({ length: lines.length }, () =>
    Array.from({ length: lines[0].length })
  );

  function outOfBoundary(r, c) {
    if (r >= lines.length || r < 0) {
      return true;
    }
    if (c >= lines[r].length || c < 0) {
      return true;
    }
  }

  function findRegionPrice(r, c) {
    const plant = lines[r][c];
    let area = 0;
    let perimeter = 0;

    function go(r, c) {
      area++;
      visited[r][c] = true;

      for (let dir of dirs) {
        const nR = r + dir[0];
        const nC = c + dir[1];

        if (outOfBoundary(nR, nC)) {
          perimeter++;
        } else if (!visited[nR][nC] && lines[nR][nC] === plant) {
          go(nR, nC);
        } else if (lines[nR][nC] !== plant) {
          perimeter++;
        }
      }
    }
    go(r, c);

    return area * perimeter;
  }

  let totalPrice = 0;
  for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      if (!visited[r][c] && !outOfBoundary(r, c)) {
        totalPrice += findRegionPrice(r, c);
      }
    }
  }

  return totalPrice;
}

const testInput2 = `AAAA
BBCD
BBCC
EEEC`;

const testInput3 = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;

const testInput = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

//console.log(countPrice(testInput));
