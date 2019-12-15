import {log} from "../logger";

function getReactions() {
  const res = new Map<string, {
    count: number,
    from: {chem: string, count: number}[],
  }>();
  function withCount(p: string) {
    const [count, chem] = p.trim().split(" ");
    return {count: Number(count), chem};
  }
  for (const line of INPUT.trim().split("\n")) {
    const [fromP, toP] = line.split(" => ");
    const to = withCount(toP);
    res.set(to.chem, {
      count: to.count,
      from: fromP.split(", ").map(withCount),
    });
  }
  return res;
}

function run1() {
  const reactions = getReactions();
  const amounts = new Map<string, number>();
  function getAmount(chem: string) {
    return amounts.get(chem) || 0;
  }
  function addAmount(chem: string, count: number) {
    amounts.set(chem, getAmount(chem) + count);
  }
  function balance(chem: string) {
    if (chem === "ORE")
      return;
    const amount = getAmount(chem);
    if (amount >= 0)
      return;
    const reaction = reactions.get(chem);
    if (!reaction)
      throw new Error();
    const {count, from} = reaction;
    const times = Math.ceil(-amount / count);
    addAmount(chem, times * count);
    for (const fr of from)
      addAmount(fr.chem, -times * fr.count);
    for (const fr of from)
      balance(fr.chem);
  }
  addAmount("FUEL", -1);
  balance("FUEL");
  log(-getAmount("ORE"));
}

function run2() {
  const reactions = getReactions();
  let amounts = new Map<string, number>();
  function getAmount(chem: string) {
    return amounts.get(chem) || 0;
  }
  function addAmount(chem: string, count: number) {
    amounts.set(chem, getAmount(chem) + count);
  }
  function balance(chem: string) {
    const amount = getAmount(chem);
    if (amount >= 0)
      return;
    if (chem === "ORE")
      throw new Error("ORE");
    const reaction = reactions.get(chem);
    if (!reaction)
      throw new Error();
    const {count, from} = reaction;
    const times = Math.ceil(-amount / count);
    addAmount(chem, times * count);
    for (const fr of from)
      addAmount(fr.chem, -times * fr.count);
    for (const fr of from)
      balance(fr.chem);
  }
  addAmount("ORE", 1000000000000);

  let fuelRequest = 0;
  let fuelRequestIncrement = 2 ** 40;
  while (fuelRequestIncrement) {
    const amountsCopy = new Map(amounts);
    addAmount("FUEL", -fuelRequestIncrement);
    let success;
    try {
      balance("FUEL");
      success = true;
    } catch (e) {
      if (e.message !== "ORE")
        throw e;
      success = false;
    }
    if (success)
      fuelRequest += fuelRequestIncrement;
    else {
      amounts = amountsCopy;
      fuelRequestIncrement = Math.floor(fuelRequestIncrement / 2);
    }
  }
  log(fuelRequest);
}

export const run = run2;

const INPUTS = `\
157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT

2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF

171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX

1 RNQHX, 1 LFKRJ, 1 JNGM => 8 DSRGV
2 HCQGN, 1 XLNC, 4 WRPWG => 7 ZGVZL
172 ORE => 5 WRPWG
7 MXMQ, 1 SLTF => 3 JTBLB
1 DSRGV => 4 SLZF
2 HDVD, 32 LFKRJ => 4 FCZQD
9 LNRS, 18 WKMWF => 8 RNQRM
12 MWSGQ => 9 DCKC
6 SLTF, 5 XLNC => 1 KFBX
4 QNRZ, 1 QHLF, 15 FWSK => 9 SFJC
9 KFBX, 15 RPKGX, 2 QNRZ => 6 LFKRJ
8 SFJC, 6 ZQGL, 4 PFCGF => 3 THPCT
2 RNQHX, 4 PFCGF, 1 ZQGL => 6 LNRS
195 ORE => 4 PTHDF
3 FJKSL => 7 FWSK
12 KBJW, 9 MWSGQ => 9 WKMWF
3 XLNC => 5 RPKGX
188 ORE => 7 FJKSL
6 ZNPNM, 3 KHXPM, 3 TJXB => 2 HSDS
1 DGKW, 17 XLNC => 1 PFCGF
2 VRPJZ, 3 DSRGV => 5 MWSGQ
12 BJBQP, 5 XLNC => 4 HCQGN
1 GFCGF => 3 HDVD
18 TJXB, 2 THPCT, 1 WPGQN => 4 KHXPM
1 ZGVZL => 1 JNGM
3 ZGVZL => 8 KBJW
12 GFCGF => 8 BJBQP
7 MXMQ, 18 WRPWG => 9 XLNC
13 ZGVZL, 1 QNRZ => 6 RNQHX
5 HRBG, 16 QNRZ => 9 WPGQN
5 SFJC, 1 PFCGF, 1 KHXPM => 5 FXDMQ
1 KBJW, 5 BNFV, 16 XLNC, 1 JNGM, 1 PFCGF, 1 ZNPNM, 4 FXDMQ => 5 VBWCM
5 ZGVZL, 5 LFKRJ => 9 QHLF
14 JTBLB => 5 VRPJZ
4 FWSK => 9 RXHC
2 HRBG, 3 FCZQD => 8 DRLBG
9 KLXC, 23 VBWCM, 44 VPTBL, 5 JRKB, 41 PFCGF, 4 WBCRL, 20 QNRZ, 28 SLZF => 1 FUEL
1 DRLBG => 5 VPTBL
13 LNRS => 7 ZNPNM
3 WPGQN => 9 TJXB
5 GFCGF, 3 HCQGN => 5 ZQGL
1 KHXPM, 4 LMCSR, 1 QHLF, 4 WKMWF, 1 DGKW, 3 KBRM, 2 RNQRM => 4 KLXC
171 ORE => 8 ZJGSJ
3 ZJGSJ => 3 MXMQ
124 ORE => 5 SLTF
22 KHXPM, 10 FXDMQ => 6 KBRM
2 FCZQD => 8 LMCSR
7 DCKC, 8 HSDS, 7 PFCGF, 16 ZNPNM, 3 RNQRM, 3 WKMWF, 2 WBCRL, 14 RXHC => 7 JRKB
7 DCKC, 2 MWSGQ => 3 BNFV
2 ZQGL => 9 DGKW
22 WRPWG => 6 HRBG
22 KBJW, 1 KFBX, 1 THPCT => 6 WBCRL
4 WRPWG, 1 RXHC, 21 FWSK => 8 QNRZ
1 PTHDF => 8 GFCGF
`.split("\n\n");

const INPUT = INPUTS[3];
