import {log} from "../logger";

interface Modulo {
  n: number;
  align(a: number): number;
  add(a: number, b: number): number;
  mul(a: number, b: number): number;
  inv(a: number): number;
}

function modulo(n: number): Modulo {
  const modulo: Modulo = {
    n,
    align: (a: number) => (a + n) % n,
    add: (a: number, b: number) => (a + b + n) % n,
    mul: (a: number, b: number) => {
      const args = [a, b];
      const direct = a * b;
      if (Number.isSafeInteger(direct))
        return direct % n;
      let res = 0;
      while (b) {
        while (!(b & 1)) {
          a = (2 * a) % n;
          b /= 2;
        }
        res = (res + a) % n;
        b -= 1;
      }
      return res;
    },
    inv: (a: number) => {
      function gcdExt(a: number, b: number): {x: number, y: number} {
        if (!a)
          return {x: 0, y: 1};
        const {x, y} = gcdExt(b % a, a);
        return {
          x: y - Math.floor(b / a) * x,
          y: x,
        };
      }
      return modulo.align(gcdExt(a, n).x);
    },
  };
  return modulo;
}

class Shuffle {

  private invA?: number;

  constructor(
    readonly mod: Modulo,
    readonly a: number,
    readonly b: number,
  ) {
  }

  getCardPos(i: number) {
    return this.mod.add(this.mod.mul(this.a, i), this.b);
  }

  getCardAtPos(i: number) {
    if (this.invA === undefined)
      this.invA = this.mod.inv(this.a);
    return this.mod.mul(this.mod.add(i, -this.b), this.invA);
  }

  then(sh: Shuffle) {
    if (sh.mod.n !== this.mod.n)
      throw new Error();
    return new Shuffle(
      this.mod,
      this.mod.mul(this.a, sh.a),
      this.mod.add(this.mod.mul(this.b, sh.a), sh.b),
    );
  }

  repeat(t: number) {
    let a: Shuffle = this;
    let res = noShuffle(this.mod);
    while (t) {
      while (!(t & 1)) {
        a = a.then(a);
        t /= 2;
      }
      res = res.then(a);
      t -= 1;
    }
    return res;
  }

  log() {
    if (this.mod.n > 100)
      log("n too high");
    else {
      const arr = [];
      for (let i = 0; i < this.mod.n; i++)
        arr.push(this.getCardAtPos(i));
      log(arr);
    }
  }

}

function dealIntoNewStack(mod: Modulo) {
  return new Shuffle(mod, mod.align(-1), mod.n - 1);
}

function cut(mod: Modulo, k: number) {
  return new Shuffle(mod, 1, mod.align(-k));
}

function dealWithIncrement(mod: Modulo, k: number) {
  return new Shuffle(mod, k, 0);
}

function noShuffle(mod: Modulo) {
  return new Shuffle(mod, 1, 0);
}

function parse(input: string, n: number) {
  const mod = modulo(n);
  const lines = input.trim().split("\n");
  let shuffle = noShuffle(mod);
  for (const line of lines) {
    let sh: Shuffle;
    if (line === "deal into new stack")
      sh = dealIntoNewStack(mod);
    else if (line.startsWith("deal with increment "))
      sh = dealWithIncrement(mod, Number(line.split(" ").pop()));
    else if (line.startsWith("cut "))
      sh = cut(mod, Number(line.split(" ").pop()));
    else
      throw new Error(line);
    shuffle = shuffle.then(sh);
  }
  return shuffle;
}

function run1() {
  const shuffle = parse(INPUT, 10007);
  const cardPos = shuffle.getCardPos(2019);
  log(cardPos);
  log(shuffle.getCardAtPos(cardPos));
}

function run2() {
  const N = 119315717514047;
  const M = 101741582076661;
  const shuffle = parse(INPUT, N).repeat(M);
  log(shuffle.getCardAtPos(2020));
}

export const run = run2;

const INPUT = `
deal with increment 16
cut -7810
deal with increment 70
cut 8978
deal into new stack
deal with increment 14
cut 9822
deal with increment 31
cut -3630
deal with increment 37
cut -929
deal with increment 74
cut -9268
deal with increment 47
cut -7540
deal with increment 13
cut -5066
deal with increment 73
cut 1605
deal into new stack
cut 1615
deal with increment 72
cut 1025
deal with increment 28
cut 6427
deal with increment 10
deal into new stack
cut -8336
deal with increment 33
cut -9834
deal with increment 64
deal into new stack
deal with increment 42
cut 7013
deal into new stack
deal with increment 55
deal into new stack
cut 8349
deal into new stack
deal with increment 41
cut -9073
deal with increment 11
deal into new stack
deal with increment 46
cut 613
deal with increment 66
cut 4794
deal with increment 3
cut -6200
deal with increment 52
deal into new stack
cut 1328
deal with increment 29
cut -1670
deal into new stack
cut -706
deal with increment 66
cut -2827
deal with increment 6
cut 8493
deal with increment 10
deal into new stack
deal with increment 75
cut 3163
deal with increment 14
cut 4848
deal with increment 66
deal into new stack
deal with increment 52
deal into new stack
deal with increment 71
deal into new stack
deal with increment 50
cut -9466
deal with increment 46
cut -9621
deal into new stack
deal with increment 14
deal into new stack
cut 7236
deal with increment 71
cut -9836
deal with increment 16
deal into new stack
cut -1519
deal with increment 53
cut -5190
deal with increment 68
cut 4313
deal into new stack
deal with increment 39
deal into new stack
deal with increment 5
cut 3476
deal with increment 61
cut -2533
deal with increment 10
cut 4921
deal with increment 67
cut 3563
`;
