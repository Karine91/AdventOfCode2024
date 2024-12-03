const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = getAllMultiplications(data);

    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function getAllMultiplications(str) {
  const regexp = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const matches = str.matchAll(regexp);

  let result = 0;
  for (let mul of [...matches]) {
    const [_, val1, val2] = mul;
    result += Number(val1) * Number(val2);
  }

  return result;
}

const testInput =
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

console.log(getAllMultiplications(testInput));
