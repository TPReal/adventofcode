import {log} from "../logger";

function parse(input: string) {
  return parseInt(input.trim().split("\n").join("")
    .split("").map(c => c === "#" ? "1" : "0").reverse().join(""), 2);
}

function run1() {
  function step(m: number) {
    let res = 0;
    for (let w = 0; w < 25; w++) {
      const mask = 1 << w;
      const x = w % 5;
      const neighbours = [
        mask << 5,
        mask >>> 5,
        x === 0 ? 0 : mask >>> 1,
        x === 4 ? 0 : mask << 1,
      ];
      const numNeighbours = neighbours.reduce((a, n) => a + ((m & n) ? 1 : 0), 0);
      if ((m & mask)) {
        if (numNeighbours === 1)
          res |= mask;
      } else
        if (numNeighbours === 1 || numNeighbours === 2)
          res |= mask;
    }
    return res;
  }

  function logMap(m: number) {
    let arr = m.toString(2).split("").map(c => c === "1" ? "#" : ".");
    arr = [...arr.reverse(), ...new Array(25 - arr.length).fill(".")];
    for (let l = 0; l < 25; l += 5)
      log(arr.slice(l, l + 5).join(""));
    log("\n");
  }

  let m = parse(INPUT);
  const known = new Set<number>();
  while (!known.has(m)) {
    logMap(m);
    known.add(m);
    m = step(m);
  }
  log(m);
}

export const run = run1;

const INPUTS = `\
....#
#..#.
#..##
..#..
#....

##.##
#.##.
#...#
##.#.
####.
`.split("\n\n");

const INPUT = INPUTS[1];
