const fs = require("node:fs");
const path = require("path");

fs.readFile(path.resolve(__dirname, "input.txt"), "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.time("start");
    const res = getMinTokensForPrize(data);
    console.log("Result: ", res);
    console.timeEnd("start");
  }
});

function getMinTokensForPrize(data) {
  const tokenA = 3;
  const tokenB = 1;

  const machines = data.split("\n\n");

  function getMinTokens({ aX, aY, bX, bY, pX, pY }) {
    const n = Math.round(
      (aX * pY * aX * aY - aY * pX * aX * aY) /
        ((aX * bY - aY * bX) * (aX * aY))
    );

    const m = Math.round((pX - bX * n) / aX);

    // after rounding if equations not right than return false;
    if (aX * m + bX * n !== pX || aY * m + bY * n !== pY) {
      return false;
    }

    return m * tokenA + n * tokenB;
  }

  let total = 0;

  for (let machine of machines) {
    const regExpA = /Button A: X\+(\d+), Y\+(\d+)/;
    const matches = machine.match(regExpA);
    const aX = Number(matches[1]);
    const aY = Number(matches[2]);

    const regExpB = /Button B: X\+(\d+), Y\+(\d+)/;
    const matchesB = machine.match(regExpB);
    const bX = Number(matchesB[1]);
    const bY = Number(matchesB[2]);

    const regExpP = /Prize: X=(\d+), Y=(\d+)/;
    const matchesP = machine.match(regExpP);
    const pX = Number(matchesP[1]);
    const pY = Number(matchesP[2]);

    const tokens = getMinTokens({
      aX,
      aY,
      bX,
      bY,
      pX: pX + 10000000000000,
      pY: pY + 10000000000000,
    });
    if (tokens) {
      total += tokens;
    }
  }

  return total;
}

const testInput = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

console.log("test:", getMinTokensForPrize(testInput));
