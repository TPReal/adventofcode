import {log} from "../logger";

function binToInt(code: string, low: string) {
  let m = 1 << (code.length - 1);
  let res = 0;
  for (const c of code.split("")) {
    if (c !== low)
      res += m;
    m >>= 1;
  }
  return res;
}

function rowCol(code: string) {
  return [binToInt(code.slice(0, 7), "F"), binToInt(code.slice(7, 10), "L")];
}

export function run() {
  const map = Array.from({length: 128}, () => Array.from({length: 8}, () => " "));
  for (const l of INPUT.split("\n")) {
    const [r, c] = rowCol(l);
    map[r][c] = "#";
  }
  log(map.map((r, i) => `${i}: ${r.join("")}`).join("\n"));
  log(8 * 76 + 4);
}

const INPUTS = `\
FBFFFFFLLL
FFBFFFFRRR
FFFBBBBLRL
FBFFBBFLLL
FFFBFBBLLL
FBFFFFBRLR
BFFBBFBLLL
FBFBFFBLLL
BFFFBBBRLL
FBFBBFBRLR
BFBFFFBRLR
FFFBBFFRLR
FFFFFBFRRR
FBFBBBFRRL
FBFBBFBRRR
FBFBBBFLRR
BBFFFBBRLL
FBBBBBFRLL
FBFFFFBLLR
FBFFFFFLRR
FBFBFFBLRR
FBFBFBBRRL
FFFFBFFRRL
FFFFBBFLRR
BFFBBFBRLR
BBFFFFFRLR
FFBFBBBRLL
FFBFBBBLRL
FBFFFBBLLL
FFFFBBFRLR
FBFBBFFLLR
FBBFFBFRLL
BFFFBFBLLR
FBFFBBBLLL
FFFFBBBLRR
FFBFFBFLLL
BFBFBFBRRL
BFBFFFBRRL
FBFBFBFLLL
FBBBBFFRRR
FBFFBFBRRR
BBFFFFFRRL
BFFFFFFLRL
FFFFFBBLLR
FBBFBFBRRL
BFBFFBFLLL
FFFFBBBRLL
BFFFBFBRLL
FFFBBFFLLL
BFFFFFBRLR
FBFBBFFRLR
BFFBBBFRLR
BBFFBFFRRR
BFFBFFFRLL
FFFBBBFLLR
FBFBFFFRRL
FBBFFFBLLR
BFBFFBFLRR
BFFBBFBRRR
FFFBBBBRLR
BBFFBFFRLR
FBBBBBFRRR
FBFBBBFRLR
FBFFFBBLRL
FFBFBFFLRR
BFFFBFFRLL
FBFFBFBLRL
BFBBFBFLLR
BFFFBBFRLL
BFBFBFBLRR
BFFFFBBRLR
BFBBFFBRRL
BFFBFFBRRR
FBFFFBFRLL
FFFFBFFLLR
FBFFFBFLLR
FBFFFFFRRL
FBBBFBBLLR
BFBFFFBLLR
BFFBFFBLLR
FFFBBBFRLL
FBBBBFFRRL
FBBFBBFRRR
BFBFBFFLLR
BFFFBBBRRL
FBBFBBBRRL
FFBFBBFRLL
FBBFBFFLLL
FBBBBBFRLR
BFBFBFFRRL
BFFBBFFRRR
BFBFBFBRLL
BFFBFFBRLR
BBFFBFBLRL
FFBFBFBLLL
FFBBBFBRRR
BBFFFFBLRR
BFBBBBBRLR
BFFFFFBLLR
FBFBBBBRRR
FBBBFBFLRR
FBBFBBFLLL
BBFFFFBLRL
FFBBFBFLLL
FBBBBFBLLR
FFFBBBBRRL
FFBFFBFRLL
BFFBBBFLLR
FFFBFBBLRR
FFBBFFBLLR
FFBFFBFLRR
FBBBBFBLRL
FBBBFBFRLL
FBFBFFFRLL
FBBFBBFRLR
BFFFFBBLLL
FBFBFBFLRL
FBBBFFBRRR
FFFFBFFLLL
BFBBBFFRLL
FBBBFBFLLR
FBBFBBFLRR
FBFFBBBLRL
FBFFBBFLRR
FBBBFFBRRL
FBFBBFBRRL
FBFBBFBLRL
BFBFFBBLLL
FBFFFBFLRR
FBFFBBFRLL
FFBBFFFRLR
FBFBBBBRLL
FBBBBFFRLR
BFBFBFBRLR
BFFBFBFRLR
FFFBFFBLLL
FFFFBBFLLR
FFBFBBFRRL
FBBFBFBRLR
FBFBBFBLRR
BFBBBBFLRL
BFFFFBBRRR
FBBFBFBLLL
BFFFFBFLLR
FFFFFBBLRR
FFFBFBBRRL
BFBFFFFRRR
FBFBBFFLRL
FBFFBBBRLL
FFBBBBFLLR
FFFBFFBLLR
FBFFFFFRLL
BFBFFFBLLL
FBBBBFBRLL
FFFFFFBRRL
FFBFBFBLLR
FBFBFBFRLR
FBBBBBBLLL
BFFBFFBLRL
FFBBBFBLRL
FBBFFFFRLL
BBFFBFBLRR
BFBFFBFLLR
FFBBFBBRLR
FBBFFFFRRL
FBFFBFBRLR
BFBFBFFLLL
FFFBFFFLLL
BFBFBFFLRL
BFBFBBFLLL
FFFBBBBLRR
BFFBFBFLLL
BFBBFBFRRR
BFBBFFFLLL
BFFFBBBLRL
FFBBFBFLRL
FFFFBFBLLR
FBFBFFFLLL
BFBFFFBLRR
FFBBFBBLLR
FFFFBBFLRL
BFBBFBBLLR
BFFBBFBLLR
BFFBFFBRLL
BFFFBBFLLR
FFBBFBFLLR
FBBBFFBRLR
FFBFBFFLLR
FBFFFBBRLR
FBBFFFBRLL
FBBFFBBLRL
BBFFFFBRRL
FFBFFFBRLL
BFFFBFFLRL
FFFFFBBRRR
FBFFBBFRRL
FBFBFBFLRR
FBBFFBFLRR
BFBBFBBLLL
FFFBFBFLRL
BBFFFFBLLR
BBFFBFBLLL
BFBBFBFRRL
FBBFFFBRRL
BFFBBBFLRR
FFBBBBFRRL
FBBBBBBRLR
FFFBFFBRRL
FFFBBFBLRL
FBBBBBBRRL
FFFFBFFRRR
FFFBBBBRLL
FFBBFFBLLL
BFBFBBFRLR
FFBFFBBRLL
BFBBBBFLRR
FBFFBFFLLR
FBBBFFBLLR
BFFBBBBRRR
FFBFFFFLRL
BFFBBFBRLL
FFBFBBBRRL
FFBBBFFRLL
FBBFFBFLLR
FBFFBFFLRR
BBFFFFFLRL
FFBBBBFRLR
BBFFFBBLRR
FFFFFFBRRR
FBBBFBBLRL
BFFBBFBRRL
BFBFBBFRRL
BFBBFBBRLL
BFBFFFBRLL
BFFBFFFLRL
BFFBBBBRLL
FFBBBBBRRL
FBBFFBFRRR
BFBBBBBLRL
BFFFFFBLRL
BBFFFFBRLR
FFBBBBBLRL
BFFBFBFLRL
BFBBFFFLRR
BFFBBBFLRL
BFFBFFFLRR
BFBBFBFLRR
BBFFFFFLLR
FFBFFBBLRL
BFFBBBBLLR
FBFFBBBRLR
BFFFFBBLRR
BFFFBFFRRR
FBBFFBBRLL
FBFBFBFRRL
FFFFBFBRRR
FFBBBFBRLL
FBFFBFBRRL
FFBFBFBLRR
BFFFFFFRLL
BFFBFFBRRL
FBFBFFFLLR
BFBFFBBRLL
FFBFFBBLLR
FBFBBFBLLL
FFBBFBFLRR
FFFBBFBRLL
FBBFFBFLRL
FFBFBFFRRR
FBBBFBBRLL
FBFFFFBLRL
FFFFFFBLRR
BFFBFFFRRL
BFFBFBBLRR
FBBFFFBLRL
FBFFBBFRRR
BBFFFBFLRL
BBFFBFFLRL
FFBBFFFLRR
BFBBBFBLLR
FBFBFBFRLL
BFBFBBFRLL
FFBBFBBRLL
BFBBBFBRRL
BFFFBBFLRR
FFFBFFFRLL
BBFFBFFLRR
BBFFBFFLLR
FFFBFFBLRR
BFFBFFFRRR
FBFBFFFRLR
FBFBFFBLLR
FBBFBFBLRR
FBFBBBBLRL
FBFBBFFRRR
BFFFFBFLRR
FBBFBBBRLL
FFBFFBBLRR
FFBFBFFRLR
FBBBBBBLLR
BFBFFFFLRR
BFFFBBFRRR
FFBFBFFLLL
FFBFBBFRRR
BFFBBBFRLL
BFBBFBFRLL
BFBBBFFRRR
BFFFBBBLRR
FFFBBFBRLR
BBFFFBBLLR
BFFFBBBLLL
FFFBFFBRRR
BFBFBBBLRR
BFBFBFFLRR
FBFBFBBLLL
FBBBFBBLRR
FBFFBBBRRR
FFBFFBBRLR
FFFBBFFRRL
FBBFFBBRLR
BFFBFBBRRL
FBBBFFFLRL
FBBFFFFLLR
FFBBFFBRRR
FFFFFBFLRL
BBFFFFFRLL
BFBBBFFLLL
FBFBBFBRLL
FBFBBBFRLL
FBBBFFFLLR
BFBBFBBLRL
FFFFBBFLLL
BFBBBBBRRR
FFFBFBFRLR
FBFFBFBLLL
BFBBBBBLLR
FFBBFFFRLL
FFFBFFFLRL
FFBBBFFRRL
FFBFFFFRLR
BFFFBBBLLR
BFBFFFFLRL
FBBFFBFRLR
FBFFFFFRLR
BBFFFBBRRL
BBFFFBBLRL
FBFFFBFLRL
FBBFFFFLRR
FBFFFFBLRR
FBFFBFFLRL
BFBFFBFRLL
BFBFBBFRRR
FBBBFBFLLL
BBFFFFFLLL
FFFFBFFLRL
FBBFBBFLRL
FBBFBBBRLR
FFBFFFFLLR
FFBFBFBRRR
FBBBFBBLLL
FBFBBBBLLR
BFFFFBBLRL
BFFBFBFLLR
BFFBBBFRRR
BBFFFBFLRR
FBFFFFFLRL
BFFFFFFRRL
BFFBFFBLLL
BFFFFFFLLL
FFFBFFBLRL
BFFFFBFRRL
FBBBFFFRLR
BFBFBBBLRL
BBFFFBFRRR
BFFFFBBLLR
BFBFBBBRRR
FBFFFBFLLL
FBBBFBFRLR
FFFFFFBLRL
FBFBBFFRRL
BFBBFBFLLL
FFBFFBBRRL
BFBFFFFLLL
FBBFFBFLLL
FBFFFBFRRR
BFBBBBFRRL
BBFFFBFRLL
FBBFBFBLRL
FFBBFFFLRL
FBBFBBFRRL
FBBFBBFLLR
BFBFBFBLLR
FBBFFFFRRR
FBBFFBFRRL
BFFFFFFRRR
BFBBFBBRLR
FFFBFBFRLL
FBFFBBBLLR
BFBBBBBRLL
BFFBFFFRLR
BFBBBFFLRL
BFBBBFFRRL
FFBBFBFRRR
FFBFBBFRLR
FFBFBFFLRL
FBFBFFBLRL
FBBBFFBLRR
BFBBBFFRLR
BBFFBFFRRL
FBBBBBFRRL
FBFBBFFLLL
BFBBFBFRLR
FFBFBFFRRL
BBFFFFFLRR
FBBBFBFRRL
BFBFBBBRLR
FFBFFBFRLR
FFBBFBFRLR
FBFFBFFLLL
BFBFBBBLLL
BFFFFFBRLL
FFBFBBFLRR
BFBBFFFLRL
BFFFFBFLRL
FFBBFBFRRL
FFFFBBFRRR
FBFBFFBRLL
FBBBBFBLRR
BFBBFBBRRL
FFFBFBFRRL
FBFFBFBLLR
FFBFBBBLRR
BBFFFBFLLL
BFBBBBFRLR
FFFFFBFRLL
BBFFFBBRRR
BFFBBFFRLR
FBFBBBFLRL
BFBBFFBLRL
BFBBBFFLRR
FBBBFFFRRR
FFFFBFBLRL
BFFBBBFLLL
FBBBBFBRRL
BFFBFBBRRR
FBBBBBFLLR
BFBFBBBRLL
FFFFFBFLRR
BFFFBBFRRL
FFFBBBFLRL
FBBBBFBLLL
FBBFBBBLLR
FBFBBFBLLR
FBFBFFFLRR
BFFFFBFRLR
FFFBBBBLLL
BFBFFFFRRL
FBFBBBBLRR
FBBBBFFLRL
BFBBBFBLLL
FBBFFFBRRR
FFFBBFFLRL
FBBFFFFLLL
BFFFFBBRLL
FBBBBFBRLR
FFBBBFBLLL
BFFFBFFLLL
BFBBBBBLRR
FFBFFFFLRR
FBBFBFFRLL
BFFBBBFRRL
FFFBFBFLLR
BFFFBFFRRL
FBFBFBBLLR
FBFBBBFRRR
FBBFBFBRLL
BBFFFBBLLL
FBFFBFBRLL
BFBFFBBLLR
FFFBBFFLRR
FBBFBBBLRL
FFFFBFFRLL
FFBBFFFLLL
BFFBBBBLRL
BFBBBFFLLR
FFBBFBFRLL
BFBBBFBLRL
BFBBBFBRLR
BFFBBFFLRL
FFBBBBBRLL
FBBFBFFLRR
FFFBBFBLRR
FBBFFBBRRL
FFFBBFBLLR
FFFBBFBLLL
FBFBFFFRRR
FFFFFFFRRR
BFFFBFFLLR
FFBFFBFLRL
FFFBFFFLRR
FBBFBFFRLR
FBFBFBFLLR
FBFFFBBRRL
FBFFFBBRLL
FFBBFFBLRL
FFFFBFBRRL
FFFFFBFRRL
BFBBFFBLLR
FBFFFBBLRR
FFFFBFFRLR
BFFBBFFLRR
FBBBBBFLLL
BBFFBFFRLL
BFFFFFBRRL
FFFBBBFLLL
FFBBBBBRLR
FFBBBBBLRR
BFFFFFFLRR
FFFBBBFRRR
FFBBBFBRRL
BFBBBFBLRR
FBBFFBBLLR
FFFBFBBRRR
FBFBFBBRRR
FBBFFFBLRR
FFBFFFBLRR
FFBFBBBRLR
FFFBFBFRRR
BFFBFBFRLL
FFFFFBBLRL
FFBBFFFRRL
FFBFBBBRRR
FFBFFBBRRR
FFFFFBBRLL
FFFFBBBLLL
FBFBFFBRRL
FFFBFBFLRR
BFBBFBBRRR
BFFBFBBLLR
BFBFBBBLLR
FBBBBBBRLL
BFFBFBBRLL
FBFFBFFRRR
BFFFBFBRLR
FFBBFBBLRL
BFFFBBFLRL
FFFBBFFRRR
BFFBFFBLRR
FFFFFFBLLR
BFFBFBBRLR
FBFBBBBRRL
BFBBFFFRLL
FBFBBFFLRR
FBBFBBFRLL
FFBBFBBLRR
BFBBFFBRRR
FBBBFBFRRR
FFFFBFBRLR
FFFFFBFRLR
FBBBFFFRRL
FBBFFFFRLR
FFFFBBFRLL
FBBBFBFLRL
BBFFFBFRLR
BFBBFFFLLR
BFFBFBFRRL
FBBBFBBRLR
FBBFBFBRRR
FBFFBBFRLR
FFBBFBBRRL
FBFFFFBLLL
FBFFBBFLLR
BBFFBFBRLR
FBFBBBFLLR
FFFFFFFRRL
FFBFBBBLLL
FFFFBFBLRR
BFFFBFFLRR
FFFFBBBLLR
FFBFBFBRLR
BFFBBFFLLL
BFBBBFBRLL
BBFFFBFLLR
FFFBFBFLLL
FFFFBFFLRR
FFBBBBBLLL
FFFFFBFLLL
FBFBFBBLRR
BFFFFFBLLL
BFBBFFBRLL
FBFBFBBRLR
FBFBFBBLRL
FBBBBBBLRR
FFBFFFBRRL
FBBFBFFLLR
FBBFFBBRRR
BFBBBBFLLR
BFFBBBBRRL
FFFBFFFRRR
BFBFBBFLLR
FFBBFFBLRR
BFFBFFFLLL
FBBFBFBLLR
FFBFFFBLLL
FFFBFFFRRL
FFBFFFFRRL
FFFBBBFRLR
FBFFBBBLRR
FFBBFFBRLR
FFFBBFBRRL
BFFFFFBLRR
BFBFBFFRLR
FFBBFBBLLL
FFFFFBBLLL
FFFFBBBRRL
BFFBFBFLRR
FFBBFFBRLL
FFBFBFBRRL
BFBFFFFLLR
BFFBBBBLRR
FFFBBBBRRR
FFBFBFBLRL
FBFFFBBRRR
FFBFFFFLLL
FFBBBFFRLR
FBFBBBBRLR
FBBBBFFLLR
BFFFBFBRRR
FBBFBBBRRR
FFBFFBFLLR
FFBBBFBLRR
BFBFFFFRLL
BFBBBBBLLL
BFBFFBFRRR
BFFFBFBRRL
FBFBBBFLLL
FFBBBBFLLL
BFFBBFFLLR
BFBFFBFRLR
FBBBBFBRRR
FBFFFBFRRL
FFBBBFBLLR
FBFFBBFLRL
BFFBFBBLLL
FFFFFFBRLR
FBBFBBBLLL
FFFBFFBRLR
BFBBBFBRRR
BFFFFFFRLR
BFFFBBFRLR
FFBBBBFRRR
FFFFFBBRLR
BFBFFBBRRR
FBBFBFFRRR
FFBBBBFLRL
FBBBFBBRRL
FBBBBBBLRL
FBBBBBFLRR
BFBFFBFRRL
FFFFBFBRLL
FBBBBFFRLL
FBBFFFBLLL
BBFFFBFRRL
FFBFFFBLRL
FFFBFFFLLR
FFBFFFBLLR
BFFFBFBLLL
BFBBBBFRRR
BFBBFBBLRR
BFBBFFBLLL
FBFFBFFRRL
FBBFBFFRRL
FFFBBBBLLR
FFBBBFFLLL
BFFBBFBLRR
FBFBFFBRLR
FFBFFFBRRR
FFFFBBBRRR
BFBFFFFRLR
FFBBBFFLLR
FBBBFFFRLL
FBBFFBBLRR
FFBBBFFLRR
FFBFBFBRLL
BFBFBBFLRL
BFBFFBFLRL
FBBBFFFLLL
FFBBBFFLRL
FBFBBBBLLL
FFBBBBFRLL
FBBBFFFLRR
FBFBBFFRLL
BFBFFBBLRL
FBBBFFBLLL
BBFFBFBLLR
FBBBFBBRRR
BBFFFFBRLL
FFFBFBBLLR
BFBFBBBRRL
BBFFFFFRRR
BFFFFFFLLR
FFBFFFFRLL
FBBFFFFLRL
FFFBBBFLRR
FFBFBBFLLR
BFBBFBFLRL
FFBFBBBLLR
BFFFFFBRRR
BFBBBBBRRL
BFFBFFFLLR
BFBBFFFRRL
FFFBFBBLRL
FBBBBBBRRR
FFFFBFBLLL
FFBBBFFRRR
BFFFFBFRRR
FFFFFFBRLL
FFFFFBFLLR
FFBFBBFLRL
BFFFFBBRRL
BFBFBBFLRR
FBFBFBFRRR
FBFFBFFRLL
FFFFBBBRLR
BFBBFFBRLR
BFBFBFFRRR
FFBFFFBRLR
FBBFBBBLRR
FBFFFBBLLR
FFFBBFFLLR
FBBFBFFLRL
BFFFFBFRLL
BFFFBBBRRR
FBFFFFFLLR
FFBBBBBLLR
FBFFFFFRRR
FBFBFBBRLL
BBFFFFBRRR
BFFFBFBLRR
BFFFBFBLRL
BFFFBFFRLR
FFFBFBBRLL
BFBFFFBRRR
FFBFFBFRRR
BFBFBFFRLL
BFBBBBFLLL
FBBFFFBRLR
BBFFBFBRLL
FFBFFBFRRL
BFFBBBBLLL
BFBFFFBLRL
BFBBFFFRLR
FBBBBBFLRL
FFFFBBBLRL
FFFBBFBRRR
BFFBFBFRRR
FBFFFFBRLL
FBFFBBBRRL
FFBFBBFLLL
FFFFBBFRRL
FBFFBFFRLR
BFBFFBBRRL
FFFFFFBLLL
BFBFFBBRLR
FBBBFFBLRL
BFFBBBBRLR
BBFFFFBLLL
FBFFFBFRLR
FBBBBFFLLL
BBFFFBBRLR
FFFBBBFRRL
BFBFBFBLRL
FFFFFBBRRL
BFBFBFBLLL
FFFBFBBRLR
FBBFFBBLLL
FFBBBBBRRR
BFFFBBFLLL
BFBFBFBRRR
BFFBFBBLRL
FFBBFFFLLR
BFFBBFFRRL
BFFBBFBLRL
FBFFFFBRRR
FBBBFFBRLL
FFFBFFFRLR
BFBFFBBLRR
FFBBFBBRRR
FFBBBFBRLR
FFBBFFBRRL
BFBBFFBLRR
FBFBFFBRRR
BFBBFFFRRR
FBBBBFFLRR
BFFFFBFLLL
FBFFFFBRRL
FFFBFFBRLL
BFFFBBBRLR
FBFBFFFLRL
FFBFBFFRLL
FFBBFFFRRR
BFBBBBFRLL
BBFFBFFLLL
FFBBBBFLRR
FFBFFBBLLL
FBFFBFBLRR
FFFBBFFRLL
`.split("\n\n");

const INPUT = INPUTS[0].trim();
