const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    const lines = data.split("\n");
    console.time("start");

    const res = countSafeReports(lines, true);
    console.log("Safe reports: ", res);
    console.timeEnd("start");
  }
});

function countSafeReports(lines, tolerate = false) {
  let safeReports = 0;

  function isReportSafe(report) {
    const arr = report.split(" ");
    if (arr.length > 1) {
      let prevInd = 0;
      let currInd = 1;

      let allowedFails = tolerate ? 1 : 0;

      function checkSafety(prevInd, currInd, sortOrder) {
        let prev = Number(arr[prevInd]);
        let curr = Number(arr[currInd]);
        if (prevInd == 0) {
          sortOrder = undefined;
        }
        if (!sortOrder) {
          sortOrder = curr - prev > 0 ? 1 : -1;
        } else {
          if (sortOrder === -1 && curr > prev)
            return { isSafe: false, sortOrder };
          if (sortOrder === 1 && curr < prev)
            return { isSafe: false, sortOrder };
        }
        const diff = curr - prev;
        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
          return { isSafe: false, sortOrder };
        }
        return { isSafe: true, sortOrder };
      }

      function checkReportSafety(
        report,
        prevInd,
        currInd,
        allowedFails,
        sortOrderInit
      ) {
        while (currInd < arr.length) {
          const { isSafe, sortOrder } = checkSafety(
            prevInd,
            currInd,
            sortOrderInit
          );
          sortOrderInit = sortOrder;
          if (isSafe) {
            prevInd = currInd;
            currInd++;
          } else {
            if (allowedFails == 0) return false;

            let nextPrevInd = prevInd - 1;
            let nextCurrInd = currInd;

            if (prevInd == 0) {
              nextPrevInd = 1;
              nextCurrInd = currInd + 1;
            }

            const isSafeWithoutPrev = checkReportSafety(
              report,
              nextPrevInd,
              nextCurrInd,
              allowedFails - 1,
              sortOrderInit
            );
            const isSafeWithoutCurr = checkReportSafety(
              report,
              prevInd,
              currInd + 1,
              allowedFails - 1,
              sortOrderInit
            );

            // edge case - ignore first value

            const isSafeIgnoreFirstVal =
              prevInd === 1
                ? checkReportSafety(report, prevInd, currInd, allowedFails - 1)
                : false;

            return (
              isSafeWithoutPrev || isSafeWithoutCurr || isSafeIgnoreFirstVal
            );
          }
        }
        return true;
      }

      return checkReportSafety(report, prevInd, currInd, allowedFails);
    }

    return true;
  }

  for (let line of lines) {
    const isSafe = isReportSafe(line);
    // if (!isSafe) {
    //   console.log(line, isSafe);
    // }

    if (isSafe) {
      safeReports++;
    }
  }

  return safeReports;
}

console.log(
  countSafeReports(
    [
      "7 6 4 2 1",
      "1 2 7 8 9",
      "9 7 6 2 1",
      "1 3 2 4 5",
      "8 6 4 4 1",
      "1 3 6 7 9",
    ],
    true
  )
); // 4
console.log(countSafeReports(["7 6 8 3 1"], true)); // 1
console.log(countSafeReports(["6 5 3 4 2"], true)); // 1
console.log(countSafeReports(["48 46 47 49 51 54 56"], true)); // 1
