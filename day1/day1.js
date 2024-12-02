const fs = require("node:fs");

const getTotalDistance = () => {
  fs.readFile("./input.txt", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }

    const lines = data.split("\n");

    const list1 = [];
    const list2 = [];

    lines.forEach((item) => {
      const [val1, val2] = item.split("   ");

      list1.push(Number(val1));
      list2.push(Number(val2));
    });

    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    let total = 0;
    for (let i = 0; i < list1.length; i++) {
      const val1 = list1[i];
      const val2 = list2[i];
      total += Math.abs(val2 - val1);
    }

    console.log("Distance total:", total);

    // get similarity score

    function findNumber(num) {
      const count = list2.reduce((acc, cur) => {
        const count = cur === num ? 1 : 0;
        return acc + count;
      }, 0);

      return count;
    }

    let similarityScore = 0;
    for (let i = 0; i < list1.length; i++) {
      const val = list1[i];
      const score = findNumber(val);
      similarityScore += score * val;
    }

    console.log("score:", similarityScore);
  });
};

getTotalDistance();
