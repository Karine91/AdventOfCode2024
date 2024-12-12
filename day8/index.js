const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = getAntinodesLines(data);
    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function outOfBoundary(lines, r, c) {
  if (r >= lines.length || r < 0) {
    return true;
  }
  if (c >= lines[r].length || c < 0) {
    return true;
  }
}

function getAntinodes(data) {
  const lines = data.split("\n");

  const antennas = {};

  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      const item = line[c];
      if (item != ".") {
        if (antennas[item]) {
          antennas[item].push([r, c]);
        } else {
          antennas[item] = [[r, c]];
        }
      }
    }
  }

  const antinodes = new Set();

  for (let freq of Object.keys(antennas)) {
    const anntennasWithFreq = antennas[freq];

    if (anntennasWithFreq.length > 1) {
      for (let a1 = 0; a1 < anntennasWithFreq.length - 1; a1++) {
        const [r1, c1] = anntennasWithFreq[a1];
        for (let a2 = a1 + 1; a2 < anntennasWithFreq.length; a2++) {
          const [r2, c2] = anntennasWithFreq[a2];

          const n1C = 2 * c1 - c2;
          const n1R = 2 * r1 - r2;

          if (!outOfBoundary(lines, n1R, n1C)) {
            antinodes.add(`${n1R}${n1C}`);
          }

          const n2C = 2 * c2 - c1;
          const n2R = 2 * r2 - r1;

          if (!outOfBoundary(lines, n2R, n2C)) {
            antinodes.add(`${n2R}${n2C}`);
          }
        }
      }
    }
  }

  return antinodes.size;
}

function getAntinodesLines(data) {
  const lines = data.split("\n");

  const antennas = {};

  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      const item = line[c];
      if (item != ".") {
        if (antennas[item]) {
          antennas[item].push([r, c]);
        } else {
          antennas[item] = [[r, c]];
        }
      }
    }
  }

  const antinodes = new Set();

  for (let freq of Object.keys(antennas)) {
    const anntennasWithFreq = antennas[freq];

    if (anntennasWithFreq.length > 1) {
      for (let a1 = 0; a1 < anntennasWithFreq.length - 1; a1++) {
        const [r1, c1] = anntennasWithFreq[a1];
        for (let a2 = a1 + 1; a2 < anntennasWithFreq.length; a2++) {
          const [r2, c2] = anntennasWithFreq[a2];

          const deltaC = c2 - c1;
          const deltaR = r2 - r1;

          let nR = r1;
          let nC = c1;
          while (!outOfBoundary(lines, nR, nC)) {
            antinodes.add(`${nR}-${nC}`);
            nR += deltaR;
            nC += deltaC;
          }

          nR = r1 - deltaR;
          nC = c1 - deltaC;
          while (!outOfBoundary(lines, nR, nC)) {
            antinodes.add(`${nR}-${nC}`);
            nR -= deltaR;
            nC -= deltaC;
          }
        }
      }
    }
  }

  return antinodes.size;
}

const testInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

console.log(getAntinodesLines(testInput));
