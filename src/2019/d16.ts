import {log} from "../logger";

const PATTERN = [1, 0, -1, 0];

function run1() {
  let arr = INPUT.split("").map(Number);
  for (let phase = 0; phase < 100; phase++) {
    const newArr: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      let v = 0;
      for (let j = i; j < arr.length; j++)
        v += arr[j] * PATTERN[Math.floor((j - i) / (i + 1)) % 4];
      newArr.push(Math.abs(v) % 10);
    }
    arr = newArr;
  }
  log(arr.slice(0, 8).join(""));
}

function run2() {



  let arr = INPUT.split("").map(Number);
  const offset = Number(arr.slice(0, 7).join(""));
  const multiArr = [];
  for (let i = 0; i < 10000; i++)
    multiArr.push(...arr);
  arr = multiArr;
  for (let phase = 0; phase < 100; phase++) {
    const newArr: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      let v = 0;
      for (let j = i; j < arr.length; j++)
        v += arr[j] * PATTERN[Math.floor((j - i) / (i + 1)) % 4];
      newArr.push(Math.abs(v) % 10);
    }
    arr = newArr;
  }
  log(arr.slice(offset, offset + 8).join(""));
}

export const run = run1;

const INPUTS = `\
12345678
03036732577212944063491565474664
02935109699940807407585447034323
03081770884921959731165446850517
59738571488265718089358904960114455280973585922664604231570733151978336391124265667937788506879073944958411270241510791284757734034790319100185375919394328222644897570527214451044757312242600574353568346245764353769293536616467729923693209336874623429206418395498129094105619169880166958902855461622600841062466017030859476352821921910265996487329020467621714808665711053916709619048510429655689461607438170767108694118419011350540476627272614676919542728299869247813713586665464823624393342098676116916475052995741277706794475619032833146441996338192744444491539626122725710939892200153464936225009531836069741189390642278774113797883240104687033645
`.split("\n");

const INPUT = INPUTS[1];
