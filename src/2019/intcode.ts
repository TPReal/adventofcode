import {log} from "../logger";

export interface InOut {

  read(): number | number[];

  write(v: number): void;

}

export class IntcodeComputer {

  ip = 0;
  finished = false;

  input: number[] = [];
  output: number[] = [];

  constructor(readonly memory: number[], readonly inOut?: InOut) {
  }

  static parse(memory: string, inOut?: InOut) {
    return new IntcodeComputer(memory.split(",").map(v => Number(v)), inOut);
  }

  passIn(...vs: (number | number[])[]) {
    this.input.push(...vs.flat());
  }

  getOut() {
    const out = this.output.shift();
    if (out === undefined)
      throw new Error(`No output`);
    return out;
  }

  private read() {
    if (!this.input.length && this.inOut)
      this.passIn(this.inOut.read());
    const read = this.input.shift();
    if (read === undefined)
      throw new Error(`No input`);
    return read;
  }

  private write(v: number) {
    this.output.push(v);
    if (this.inOut)
      this.inOut.write(v);
  }

  step() {
    const m = this.memory;
    this.assertInMemRange(this.ip);
    const cmd = m[this.ip];
    const opCode = cmd % 100;
    if (opCode === 1)
      this.op(3, cmd, ([a, b], [t], {setMem}) => {
        setMem(t, a + b);
      });
    else if (opCode === 2)
      this.op(3, cmd, ([a, b], [t], {setMem}) => {
        setMem(t, a * b);
      });
    else if (opCode === 3)
      this.op(1, cmd, (_, [t], {setMem}) => {
        setMem(t, this.read());
      });
    else if (opCode === 4)
      this.op(1, cmd, ([a]) => {
        this.write(a);
      });
    else if (opCode === 5)
      this.op(2, cmd, ([c, l], _, {setIp}) => {
        if (c)
          setIp(l);
      });
    else if (opCode === 6)
      this.op(2, cmd, ([c, l], _, {setIp}) => {
        if (!c)
          setIp(l);
      });
    else if (opCode === 7)
      this.op(3, cmd, ([a, b], [t], {setMem}) => {
        setMem(t, a < b ? 1 : 0);
      });
    else if (opCode === 8)
      this.op(3, cmd, ([a, b], [t], {setMem}) => {
        setMem(t, a === b ? 1 : 0);
      });
    else if (opCode === 99)
      this.finished = true;
    else
      throw new Error(`Invalid cmd: ${cmd}`);
  }

  run({debug = false, untilOutput = false}: {
    debug?: boolean,
    untilOutput?: boolean | number,
  } = {}) {
    const expectedOutputLen = typeof untilOutput === "number" ? untilOutput :
      untilOutput ? 1 : Number.POSITIVE_INFINITY;
    for (; ;) {
      if (debug)
        log(this.toString());
      this.step();
      if (this.finished || this.output.length >= expectedOutputLen)
        break;
    }
  }

  toString() {
    const memStrs: (number | string)[] = [...this.memory];
    memStrs[this.ip] = `[${memStrs[this.ip]}]`;
    return memStrs.join(",");
  }

  private op(numArgs: number, argModes: number,
    handler: (args: number[], revPosModeArgs: number[], actions: {
      setMem(p: number, v: number): void,
      setIp(l: number): void,
    }) => void) {
    this.assertInMemRange(this.ip + 1 + numArgs);
    const args: number[] = [];
    const posModeArgs: number[] = [];
    argModes = Math.floor(argModes / 100);
    for (let argIndex = 0; argIndex < numArgs; argIndex++) {
      const memArg = this.memory[this.ip + 1 + argIndex];
      if (argModes % 10)
        args.push(memArg)
      else {
        this.assertInMemRange(memArg);
        args.push(this.memory[memArg]);
      }
      posModeArgs.push(memArg);
      argModes = Math.floor(argModes / 10);
    }
    let ipChanged = false;
    handler(args, posModeArgs.reverse(), {
      setMem: (p, v) => {
        this.memory[p] = v;
      },
      setIp: (l) => {
        ipChanged = true;
        this.ip = l;
      },
    });
    if (!ipChanged)
      this.ip += numArgs + 1;
  }

  private assertInMemRange(l: number) {
    if (l < 0 || l >= this.memory.length)
      throw new Error(`Address outside of memory range`);
  }

}
