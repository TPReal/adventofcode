import {log} from "../logger";

type Vec = readonly number[];

const INDICES = [0, 1, 2];

function vecEnergy(v: Vec) {
  return v.reduce((a, p) => a + Math.abs(p), 0);
}

class Moon {

  constructor(readonly pos: Vec, readonly vel: Vec = [0, 0, 0]) {
  }

  static parse(line: string) {
    const pos = line.trim().match(/-?\d+/g);
    if (!pos || pos.length !== 3)
      throw new Error();
    return new Moon(pos.map(e => Number(e)));
  }

  applyGravity(other: Moon) {
    const dVel = INDICES.map(i => Math.sign(other.pos[i] - this.pos[i]));
    return new Moon(
      this.pos,
      this.vel.map((v, i) => v + dVel[i]),
    );
  }

  applyVel() {
    return new Moon(
      this.pos.map((p, i) => p + this.vel[i]),
      this.vel,
    );
  }

  energy() {
    return vecEnergy(this.pos) * vecEnergy(this.vel);
  }

  filterIndex(index: number) {
    return new Moon(
      this.pos.map((p, i) => i === index ? p : 0),
      this.vel.map((p, i) => i === index ? p : 0),
    );
  }

  equals(other: Moon) {
    return INDICES.every(i => this.pos[i] === other.pos[i] && this.vel[i] === other.vel[i]);
  }

}

class Moons {

  constructor(readonly moons: readonly Moon[]) {
  }

  static parse(input: string) {
    return new Moons(input.trim().split("\n").map(l => Moon.parse(l)));
  }

  applyGravity() {
    const res = [...this.moons];
    for (let i = 0; i < this.moons.length; i++)
      for (let j = 0; j < this.moons.length; j++)
        if (j !== i)
          res[i] = res[i].applyGravity(this.moons[j]);
    return new Moons(res);
  }

  applyVel() {
    return new Moons(this.moons.map(m => m.applyVel()));
  }

  step() {
    return this.applyGravity().applyVel();
  }

  energy() {
    return this.moons.reduce((a, m) => a + m.energy(), 0);
  }

  filterIndex(index: number) {
    return new Moons(this.moons.map(m => m.filterIndex(index)));
  }

  equals(other: Moons) {
    return this.moons.length === other.moons.length &&
      this.moons.every((m, i) => m.equals(other.moons[i]));
  }

}

function run1() {
  let moons = Moons.parse(INPUT);
  for (let i = 0; i < 1000; i++) {
    moons = moons.step();
  }
  log(moons.energy());
}

class PrimeComponents {

  constructor(readonly comps: ReadonlyMap<number, number> = new Map()) {
  }

  static decompose(n: number) {
    let comps = new PrimeComponents();
    let d = 2;
    while (d <= n) {
      if (!(n % d)) {
        comps = comps.addComp(d);
        n /= d;
      } else
        d++;
    }
    return comps;
  }

  private addComp(p: number, k = 1) {
    const comps = new Map(this.comps);
    return new PrimeComponents(comps.set(p, (comps.get(p) || 0) + k));
  }

  static lcm(...args: PrimeComponents[]) {
    const primes = args.map(c => [...c.comps.keys()]).flat();
    let comps = new PrimeComponents();
    for (const p of new Set(primes))
      comps = comps.addComp(p, Math.max(...args.map(c => c.comps.get(p) || 0)));
    return comps;
  }

  lcm(...others: PrimeComponents[]) {
    return PrimeComponents.lcm(this, ...others);
  }

  toNumber() {
    let result = 1;
    for (const [p, k] of this.comps)
      result *= p ** k;
    return result;
  }

  toString() {
    const parts = [];
    for (const [p, k] of this.comps)
      for (let i = 0; i < k; i++)
        parts.push(p);
    return parts.join(",");
  }

}

function run2() {
  const moons = Moons.parse(INPUT);
  const stepsParts = [];
  for (let i = 0; i < 3; i++) {
    const startMoons = moons.filterIndex(i);
    let cur = startMoons;
    let steps = 0;
    do {
      cur = cur.step();
      steps++;
    } while (!cur.equals(startMoons));
    stepsParts.push(steps);
  }
  log(PrimeComponents.lcm(...stepsParts.map(p => PrimeComponents.decompose(p))).toNumber());
}

export const run = run2;

const INPUTS = `\
<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>

<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>

<x=14, y=9, z=14>
<x=9, y=11, z=6>
<x=-6, y=14, z=-4>
<x=4, y=-4, z=-3>
`.split("\n\n");

const INPUT = INPUTS[2];
