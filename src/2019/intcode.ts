export interface InOut {

  read?(): number | number[];

  write?(v: number): void;

}

export class IntcodeComputer {

  ip = 0;
  relBase = 0;

  finished = false;

  input: number[] = [];
  output: number[] = [];

  constructor(readonly memory: number[], readonly inOut?: InOut) {
  }

  static parse(memory: string, inOut?: InOut) {
    return new IntcodeComputer(memory.split(",").map(v => Number(v)), inOut);
  }

  passIn(...vs: (number | number[] | string)[]) {
    for (const item of vs.flat())
      if (typeof item === "number")
        this.input.push(item);
      else if (typeof item === "string")
        for (let i = 0; i < item.length; i++)
          this.input.push(item.charCodeAt(i));
  }

  getOut(): number;
  getOut(length: number): number[];
  getOut(length?: number) {
    if (length)
      return this.output.splice(0, length);
    const out = this.getOut(1);
    if (!out.length)
      throw new Error(`No output`);
    return out[0];
  }

  getAllOut() {
    return this.getOut(Number.POSITIVE_INFINITY);
  }

  getOutString(length = 1) {
    return String.fromCharCode(...this.getOut(length));
  }

  getAllOutString() {
    return this.getOutString(Number.POSITIVE_INFINITY);
  }

  private read() {
    if (!this.input.length && this.inOut && this.inOut.read)
      this.passIn(this.inOut.read());
    const read = this.input.shift();
    if (read === undefined)
      throw new Error(`No input`);
    return read;
  }

  private write(v: number) {
    this.output.push(v);
    if (this.inOut && this.inOut.write)
      this.inOut.write(v);
  }

  step() {
    const cmd = this.getMem(this.ip);
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
    else if (opCode === 9)
      this.op(1, cmd, ([a], _, {adjustRelBase}) => {
        adjustRelBase(a);
      });
    else if (opCode === 99)
      this.finished = true;
    else
      throw new Error(`Invalid cmd: ${cmd}`);
  }

  run({untilOutput = false, maxSteps = Number.POSITIVE_INFINITY}: {
    untilOutput?: boolean | number,
    maxSteps?: number,
  } = {}) {
    const expectedOutputLen = typeof untilOutput === "number" ? untilOutput :
      untilOutput ? 1 : Number.POSITIVE_INFINITY;
    for (let i = 0; i < maxSteps; i++) {
      this.step();
      if (this.finished || this.output.length >= expectedOutputLen)
        break;
    }
  }

  runNonBlocking({interval = 0, stepsPerBlock = 1}: {
    interval?: number,
    stepsPerBlock?: number,
  }) {
    let timer: number | undefined;
    const step = () => {
      for (let i = 0; i < stepsPerBlock; i++)
        this.step();
      if (!this.finished)
        timer = setTimeout(step, interval);
    };
    setTimeout(step);
    return {
      stop: () => {
        clearTimeout(timer);
      },
    };
  }

  private op(numArgs: number, argModes: number,
    handler: (args: number[], revPosModeArgs: number[], actions: {
      setMem(p: number, v: number): void,
      setIp(l: number): void,
      adjustRelBase(d: number): void,
    }) => void) {
    this.assertInMemRange(this.ip + 1 + numArgs);
    const posModeArgs: number[] = [];
    const args: number[] = [];
    argModes = Math.floor(argModes / 100);
    for (let argIndex = 0; argIndex < numArgs; argIndex++) {
      const memArg = this.getMem(this.ip + 1 + argIndex);
      const argMode = argModes % 10;
      argModes = Math.floor(argModes / 10);
      let posModeArg;
      let arg;
      if (argMode === 0) {
        posModeArg = memArg;
        arg = this.getMem(memArg);
      } else if (argMode === 1) {
        posModeArg = Number.NaN;
        arg = memArg;
      } else if (argMode === 2) {
        posModeArg = this.relBase + memArg;
        arg = this.getMem(posModeArg);
      } else
        throw new Error(`Bad argmode: ${argMode}`);
      posModeArgs.push(posModeArg);
      args.push(arg);
    }
    let ipChanged = false;
    handler(args, posModeArgs.reverse(), {
      setMem: (p, v) => {
        this.setMem(p, v);
      },
      setIp: l => {
        ipChanged = true;
        this.ip = l;
      },
      adjustRelBase: d => {
        this.relBase += d;
      },
    });
    if (!ipChanged)
      this.ip += numArgs + 1;
  }

  private getMem(p: number) {
    this.assertInMemRange(p);
    return this.memory[p] || 0;
  }

  private setMem(p: number, v: number) {
    this.assertInMemRange(p);
    this.memory[p] = v;
  }

  private assertInMemRange(p: number) {
    if (p < 0)
      throw new Error(`Address outside of memory range`);
  }

}
