const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = printQueue(data);
    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function printQueue(data) {
  const [rules, updates] = data.split("\n\n");
  const rulesMap = {};
  const rulesItems = rules.split("\n");
  rulesItems.forEach((element) => {
    const [x, y] = element.split("|");
    if (x in rulesMap) {
      rulesMap[x].push(y);
    } else {
      rulesMap[x] = [y];
    }
  });

  const correct = [];
  const incorrect = [];

  const updatesLines = updates.split("\n");
  updatesLines.forEach((update) => {
    const updatesArr = update.split(",");

    updatesArr.sort((a, b) => {
      if (!rulesMap[a]) {
        return 0;
      }
      if (rulesMap[a].includes(b)) {
        return -1;
      } else {
        1;
      }
    });

    if (update === updatesArr.join(",")) {
      correct.push(updatesArr);
    } else {
      incorrect.push(updatesArr);
    }
  });

  function getMidSum(arr) {
    let result = 0;
    arr.forEach((item) => {
      const mid = Math.floor(item.length / 2);
      result += Number(item[mid]);
    });

    return result;
  }

  const correctRes = getMidSum(correct);
  const incorrectRes = getMidSum(incorrect);

  return {
    correct: correctRes,
    incorrect: incorrectRes,
  };
}

const testInput = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

console.log(printQueue(testInput));
