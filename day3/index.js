const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = getAllMultiplications2(data);

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

// console.log(getAllMultiplications(testInput));

// part 2
function getAllMultiplications2(str) {
  const line = str.replaceAll(/\n/g, "");
  const regexp = /(don't\(\)(.+?)do\(\))|(don't()(.+?)$)/g;
  const newstr = line.replaceAll(regexp, "");

  return getAllMultiplications(newstr);
}

const testInput2 =
  "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)un\ndo()?mul(8,5))xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))don't()_mul(5,5)+mul(32,64](mul(11,8)un?mul(8,5))do()don't()_mul(5,5)+mul(32,64](mul(11,8)un?mul(8,5))";

console.log(getAllMultiplications2(testInput2));
