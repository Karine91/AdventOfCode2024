const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = getTotalCalibrationResult(data);
    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function getTotalCalibrationResult(data) {
  const lines = data.split("\n");
  const valid = new Set();
  for (let line of lines) {
    const lineSplit = line.split(":");
    const testRes = Number(lineSplit[0]);
    const inputs = lineSplit[1].trim().split(" ");

    function getResult(ind, result) {
      if (ind === inputs.length) {
        if (result === testRes) {
          valid.add(testRes);
        }
        return;
      }
      const val = Number(inputs[ind]);

      getResult(ind + 1, result ? result * val : val);
      getResult(ind + 1, result ? result + val : val);
      getResult(
        ind + 1,
        result ? Number(result.toString() + val.toString()) : val
      );
    }

    getResult(0);
  }

  return [...valid].reduce((acc, cur) => {
    return acc + cur;
  });
}

const testInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

console.log(getTotalCalibrationResult(testInput));
