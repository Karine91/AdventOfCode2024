const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = compactAmphipodDrive(data);
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

const testInput = "2333133121414131402";
const testInput2 = "12345";

console.log(compactAmphipodDrive(testInput));
