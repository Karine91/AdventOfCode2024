const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = compactAmphipodDrive2(data);
    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function compactAmphipodDrive(data) {
  const idsArr = [];

  for (let i = 0; i < data.length; i += 2) {
    const file = Number(data[i]);
    const fileId = i / 2;
    const space = Number(data[i + 1]);

    for (let n = 0; n < file; n++) {
      idsArr.push(fileId);
    }
    if (!isNaN(space)) {
      for (let s = 0; s < space; s++) {
        idsArr.push(".");
      }
    }
  }

  //rearrange

  let p1 = 1;
  let p2 = idsArr.length - 1;
  while (p1 < p2) {
    if (idsArr[p1] !== ".") {
      p1++;
      continue;
    }
    if (idsArr[p2] === ".") {
      p2--;
      continue;
    }
    idsArr[p1] = idsArr[p2];
    idsArr[p2] = ".";
    p1++;
    p2--;
  }

  let sum = 0;

  for (let i = 0; i < idsArr.length; i++) {
    if (idsArr[i] === ".") break;

    sum += i * Number(idsArr[i]);
  }

  return sum;
}

function compactAmphipodDrive2(data) {
  const idsArr = [];
  const idsMap = [];

  let ind = 0;
  for (let i = 0; i < data.length; i += 2) {
    const file = Number(data[i]);
    const fileId = i / 2;
    const space = Number(data[i + 1]);

    const pos = { start: ind };
    for (let n = 0; n < file; n++) {
      idsArr.push(fileId);
      ind++;
    }
    pos.end = ind;
    idsMap.push({ id: fileId, ...pos, length: pos.end - pos.start });
    if (!isNaN(space)) {
      for (let s = 0; s < space; s++) {
        idsArr.push(".");
        ind++;
      }
    }
  }

  idsMap.sort((a, b) => b.id - a.id);

  //rearrange

  function getSpaceLength(start, end) {
    let endPos = start;
    if (idsArr[start] === ".") {
      while (idsArr[endPos] === "." && endPos < end) {
        endPos++;
      }
    }

    return { length: Math.abs(endPos - start), start, end: endPos };
  }

  function searchForFit(start, end, target) {
    let lastEmptySpace = start;
    let searching = false;
    while (start < end) {
      if (idsArr[start] !== ".") {
        start++;
        continue;
      }
      const spaceLength = getSpaceLength(start, end);

      let p = target.start;
      if (spaceLength.length >= target.length) {
        while (p < target.end) {
          idsArr[start] = idsArr[p];
          idsArr[p] = ".";
          start++;
          p++;
        }
        return [searching ? lastEmptySpace : start, target.start];
      } else {
        if (!searching) {
          searching = true;
          lastEmptySpace = start;
        }

        start = spaceLength.end;
      }
    }

    return [lastEmptySpace, target.start];
  }

  let p1 = 0;
  let p2 = idsArr.length;
  for (let file of idsMap) {
    [p1, p2] = searchForFit(p1, p2, file);
  }

  let sum = 0;

  for (let i = 0; i < idsArr.length; i++) {
    if (idsArr[i] === ".") continue;

    sum += i * Number(idsArr[i]);
  }

  return sum;
}

const testInput = "2333133121414131402";
const testInput2 = "12345";

console.log(compactAmphipodDrive2(testInput));
