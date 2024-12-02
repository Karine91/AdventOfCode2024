const fs = require("node:fs");

fs.readFile("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.log(err);
  }

  const lines = data.split("\n");

  const res = countSafeReports(lines);
  console.log("Safe reports: ", res);
});

function countSafeReports(lines) {
  let safeReports = 0;

  function isReportSafe(report) {
    const arr = report.split(" ");
    if (arr.length > 1) {
      let sortOrder;
      for (let i = 1; i < arr.length; i++) {
        const prev = Number(arr[i - 1]);
        const curr = Number(arr[i]);
        if (!sortOrder) {
          sortOrder = curr - prev > 0 ? 1 : -1;
        } else {
          if (sortOrder === -1 && curr > prev) return false;
          if (sortOrder === 1 && curr < prev) return false;
        }
        const diff = curr - prev;
        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
          return false;
        }
      }
    }

    return true;
  }

  for (let line of lines) {
    const isSafe = isReportSafe(line);
    console.log(line, isSafe);
    if (isSafe) {
      safeReports++;
    }
  }

  return safeReports;
}

console.log(
  countSafeReports([
    "7 6 4 2 1",
    "1 2 7 8 9",
    "9 7 6 2 1",
    "1 3 2 4 5",
    "8 6 4 4 1",
    "1 3 6 7 9",
  ])
);
