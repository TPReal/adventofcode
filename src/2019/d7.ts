import {log} from "../logger";
import {IntcodeComputer} from "./intcode";

function* permutations(n: number): Iterable<number[]> {
  if (n == 1)
    yield [0];
  else
    for (const pnm1 of permutations(n - 1))
      for (let i = n - 1; i >= 0; i--) {
        const cp = [...pnm1];
        cp.splice(i, 0, n - 1);
        yield cp;
      }
}

function run1() {
  const vals = [];
  for (const perm of permutations(5)) {
    let val = 0;
    for (const phase of perm) {
      const comp = IntcodeComputer.parse(INPUT);
      comp.passIn(phase, val);
      comp.run();
      val = comp.getOut();
    }
    vals.push(val);
  }
  log(Math.max(...vals));
}

function run2() {
  const vals = [];
  for (const perm of permutations(5)) {
    const comps = perm.map(phase => {
      const comp = IntcodeComputer.parse(INPUT);
      comp.passIn(phase + 5);
      return comp;
    });
    let val = 0;
    let i = 0;
    for (; ;) {
      const comp = comps[i];
      comp.passIn(val);
      comp.run({untilOutput: true});
      if (comp.finished)
        break;
      val = comp.getOut();
      i = (i + 1) % 5;
    }
    vals.push(val);
  }
  log(Math.max(...vals));
}

export const run = run2;

const INPUTS = `\
3,8,1001,8,10,8,105,1,0,0,21,46,55,76,89,106,187,268,349,430,99999,3,9,101,4,9,9,1002,9,2,9,101,5,9,9,1002,9,2,9,101,2,9,9,4,9,99,3,9,1002,9,5,9,4,9,99,3,9,1001,9,2,9,1002,9,4,9,101,2,9,9,1002,9,3,9,4,9,99,3,9,1001,9,3,9,1002,9,2,9,4,9,99,3,9,1002,9,4,9,1001,9,4,9,102,5,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,99
`.split("\n");

const INPUT = INPUTS[0];
