const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = countPricePart2(data);
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

function countPricePart2(data) {
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
    let perimeter = {};

    function go(r, c) {
      area++;
      visited[r][c] = true;

      for (let dir of dirs) {
        const nR = r + dir[0];
        const nC = c + dir[1];

        if (outOfBoundary(nR, nC)) {
          if (perimeter[dir.toString()]) {
            perimeter[dir.toString()].push([r, c]);
          } else {
            perimeter[dir.toString()] = [[r, c]];
          }
        } else if (!visited[nR][nC] && lines[nR][nC] === plant) {
          go(nR, nC);
        } else if (lines[nR][nC] !== plant) {
          if (perimeter[dir.toString()]) {
            perimeter[dir.toString()].push([r, c]);
          } else {
            perimeter[dir.toString()] = [[r, c]];
          }
        }
      }
    }
    go(r, c);

    function getSides(perimeter, dirInd, groupByInd, diffInd) {
      const group = Object.groupBy(
        perimeter[dirs[dirInd]],
        (item) => item[groupByInd]
      );

      let sides = 0;
      Object.values(group).map((item) => {
        const g = item.map((item) => item[diffInd]).sort((a, b) => a - b);

        let count = 1;
        if (g.length > 1) {
          for (let i = 1; i < g.length; i++) {
            if (g[i] - g[i - 1] > 1) {
              count++;
            }
          }
        }

        sides += count;
      });

      return sides;
    }

    function countSides(perimeter) {
      const topSides = getSides(perimeter, 0, 0, 1);
      const rightSides = getSides(perimeter, 1, 1, 0);
      const downSides = getSides(perimeter, 2, 0, 1);
      const leftSides = getSides(perimeter, 3, 1, 0);

      return topSides + rightSides + downSides + leftSides;
    }

    const sides = countSides(perimeter);

    return area * sides;
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

const testInput4 = `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`;

console.log(countPricePart2(testInput2));
console.log(countPricePart2(testInput3));
console.log(countPricePart2(testInput));
console.log(countPricePart2(testInput4));
