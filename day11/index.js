const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = countStonesPartRecursion(data);
    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function countDigits(number) {
  let count = 0;
  while (number > 0) {
    number = Math.floor(number / 10);
    count++;
  }
  return count;
}

function countStones(data) {
  function processBlink(line) {
    const result = [];
    line.forEach((item) => {
      if (item === 0) {
        result.push(1);
      } else {
        const digitsCount = countDigits(item);
        if (digitsCount % 2 === 0) {
          result.push(Math.floor(item / Math.pow(10, digitsCount / 2)));
          result.push(item % Math.pow(10, digitsCount / 2));
        } else {
          result.push(item * 2024);
        }
      }
    });

    return result;
  }

  let line = data.split(" ").map((item) => Number(item));
  for (let i = 0; i < 25; i++) {
    line = processBlink(line);
  }

  return line.length;
}

function countStonesPartRecursion(data) {
  let count = 0;
  const cache = {};

  function processBlink(stone, blinks, count) {
    if (`${stone}-${blinks}` in cache) {
      return cache[`${stone}-${blinks}`];
    }
    if (blinks === 0) {
      cache[`${stone}-${blinks}`] = count;
      return count;
    }
    if (stone === 0) {
      count = processBlink(1, blinks - 1, count);
    } else {
      const digitsCount = countDigits(stone);
      if (digitsCount % 2 === 0) {
        let count1 = processBlink(
          Math.floor(stone / Math.pow(10, digitsCount / 2)),
          blinks - 1,
          1
        );
        let count2 = processBlink(
          stone % Math.pow(10, digitsCount / 2),
          blinks - 1,
          1
        );

        count = count1 + count2;
      } else {
        count = processBlink(stone * 2024, blinks - 1, count);
      }
    }

    cache[`${stone}-${blinks}`] = count;

    return count;
  }

  let line = data.split(" ").map((item) => Number(item));
  for (let i = 0; i < line.length; i++) {
    count += processBlink(line[i], 75, 0);
  }

  return count;
}

const testInput = "125 17";

// console.log(countStonesPartRecursion(testInput));
