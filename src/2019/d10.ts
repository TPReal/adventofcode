import {log} from "../logger";

function getAsteroids() {
  const result = [];
  const rows = INPUT.split("\n");
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++)
      if (row[x] === "#")
        result.push({x, y});
  }
  return result;
}

function round(v: number) {
  const resolution = 1e-6;
  return Math.round(v / resolution) * resolution;
}

function run1() {
  const as = getAsteroids();
  const withCounts = as.map(a => {
    const angles = new Set<number>();
    for (const a2 of as) {
      if (a2 === a)
        continue;
      angles.add(round(Math.atan2(a2.y - a.y, a2.x - a.x)));
    }
    return {a, count: angles.size};
  });
  const maxCount = Math.max(...withCounts.map(({count}) => count));
  log(maxCount);
  const base = withCounts.find(({count}) => count === maxCount);
  if (!base)
    throw new Error();
  log(base);
  return base;
}

function run2() {
  const base = run1().a;
  const anglesMap = new Map<number, {a: {x: number, y: number}, dist: number}[]>();
  for (const a of getAsteroids()) {
    if (a.x === base.x && a.y === base.y)
      continue;
    let rawAngle = Math.atan2(base.y - a.y, a.x - base.x);
    if (rawAngle > Math.PI / 2 + 1e-7)
      rawAngle -= 2 * Math.PI;
    const angleKey = round(Math.PI / 2 - rawAngle);
    let angleAs = anglesMap.get(angleKey);
    if (!angleAs) {
      angleAs = [];
      anglesMap.set(angleKey, angleAs);
    }
    angleAs.push({a, dist: Math.hypot(a.x - base.x, a.y - base.y)});
  }
  const ordered = [...anglesMap.entries()].sort((a, b) => a[0] - b[0]).map(p => p[1]);
  for (const o of ordered)
    o.sort((a, b) => b.dist - a.dist);
  const destroyCount = ordered.flat().length;
  const destroyOrder: {x: number, y: number}[] = [];
  let ai = -1;
  for (let i = 0; i < destroyCount; i++) {
    do {
      ai = (ai + 1) % ordered.length;
    } while (!ordered[ai].length)
    const next = ordered[ai].pop();
    if (!next)
      throw new Error();
    destroyOrder.push(next.a);
  }
  log(destroyOrder[199]);
}

export const run = run2;

const INPUTS = `\
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##

.##.#.#....#.#.#..##..#.#.
#.##.#..#.####.##....##.#.
###.##.##.#.#...#..###....
####.##..###.#.#...####..#
..#####..#.#.#..#######..#
.###..##..###.####.#######
.##..##.###..##.##.....###
#..#..###..##.#...#..####.
....#.#...##.##....#.#..##
..#.#.###.####..##.###.#.#
.#..##.#####.##.####..#.#.
#..##.#.#.###.#..##.##....
#.#.##.#.##.##......###.#.
#####...###.####..#.##....
.#####.#.#..#.##.#.#...###
.#..#.##.#.#.##.#....###.#
.......###.#....##.....###
#..#####.#..#..##..##.#.##
##.#.###..######.###..#..#
#.#....####.##.###....####
..#.#.#.########.....#.#.#
.##.#.#..#...###.####..##.
##...###....#.##.##..#....
..##.##.##.#######..#...#.
.###..#.#..#...###..###.#.
#..#..#######..#.#..#..#.#
`.split("\n\n");

const INPUT = INPUTS[1];
