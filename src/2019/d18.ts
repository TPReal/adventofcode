import {log} from "../logger";

type Map = readonly string[];

function run1() {

  interface State {
    x: number;
    y: number;
    keys: number[];
  }

  function getStartState(map: Map): State {
    let x = 0;
    const y = map.findIndex(r => {
      x = r.indexOf("@");
      return x >= 0;
    });
    if (y < 0)
      throw new Error();
    const keys: number[] = [];
    keys.length = 26;
    keys.fill(0);
    return {x, y, keys};
  }

  function stateKey({x, y, keys}: State) {
    return [x, y, keys.join("")].join(",");
  }

  const SINE = [0, 1, 0, -1, 0];

  function neighbours(map: Map, {x, y, keys}: State) {
    const result = [];
    for (let i = 0; i < 4; i++) {
      const nx = x + SINE[i];
      const ny = y + SINE[i + 1];
      const m = map[ny][nx];
      if (m === "#")
        continue;
      if (m >= "A" && m <= "Z" && !keys[m.charCodeAt(0) - "A".charCodeAt(0)])
        continue;
      let nKeys = keys;
      if (m >= "a" && m <= "z") {
        nKeys = [...keys];
        nKeys[m.charCodeAt(0) - "a".charCodeAt(0)] = 1;
      }
      result.push({x: nx, y: ny, keys: nKeys});
    }
    return result;
  }

  function getIsTarget(map: Map) {
    const keyIndices = [...new Set(map.join("").match(/[a-z]/g))]
      .map(k => k.charCodeAt(0) - "a".charCodeAt(0));
    return ({keys}: State) => keyIndices.every(ki => keys[ki]);
  }

  function countSteps(map: Map) {
    const isTarget = getIsTarget(map);
    const visited = new Set<string>();
    let time = 0;
    let current = [getStartState(map)];
    for (; ;) {
      const next = [];
      for (const c of current) {
        const key = stateKey(c);
        if (visited.has(key))
          continue;
        visited.add(key);
        if (isTarget(c))
          return time;
        next.push(...neighbours(map, c));
      }
      if (!next.length)
        throw new Error();
      current = next;
      time++;
    }
  }

  const map = INPUT.split("\n");
  log(countSteps(map));
}

function run2() {

  type Robot = readonly [number, number];

  type Keys = readonly number[];

  interface State {
    readonly robots: readonly Robot[];
    readonly keys: Keys;
  }

  function getStartState(map: Map): State {
    const robots: Robot[] = [];
    for (let y = 0; y < map.length; y++) {
      const r = map[y];
      for (let x = 0; x < r.length; x++)
        if (r[x] === "@")
          robots.push([x, y]);
    }
    const keys: number[] = [];
    keys.length = 26;
    keys.fill(0);
    return {robots, keys};
  }

  const SINE = [0, 1, 0, -1, 0];

  function posNeighbours(map: Map, [x, y]: Robot, keys: Keys) {
    const result = [];
    for (let i = 0; i < 4; i++) {
      const nx = x + SINE[i];
      const ny = y + SINE[i + 1];
      const m = map[ny][nx];
      if (m === "#")
        continue;
      if (m >= "A" && m <= "Z" && !keys[m.charCodeAt(0) - "A".charCodeAt(0)])
        continue;
      let nKeys = keys;
      let foundKey = false;
      if (m >= "a" && m <= "z") {
        const keyIndex = m.charCodeAt(0) - "a".charCodeAt(0);
        if (!keys[keyIndex]) {
          const newKeys = [...keys];
          newKeys[keyIndex] = 1;
          nKeys = newKeys;
          foundKey = true;
        }
      }
      const robot: Robot = [nx, ny];
      result.push({
        robot,
        keys: nKeys,
        foundKey,
      });
    }
    return result;
  }

  function keyNeighbours(map: Map, robot: Robot, keys: readonly number[]) {
    function getKey(robot: Robot) {
      return robot.join(",");
    }
    const result = [];
    const visited = new Set<string>();
    let dist = 0;
    let current = [robot];
    do {
      const next = [];
      for (const c of current) {
        const key = getKey(c);
        if (visited.has(key))
          continue;
        visited.add(key);
        for (const {robot: nRobot, keys: nKeys, foundKey} of posNeighbours(map, c, keys)) {
          if (foundKey)
            result.push({robot: nRobot, keys: nKeys, dist: dist + 1});
          else
            next.push(nRobot);
        }
      }
      current = next;
      dist++;
    } while (current.length);
    return result;
  }

  function neighbours(map: Map, {robots, keys}: State) {
    const result = [];
    for (let ri = 0; ri < robots.length; ri++) {
      for (const {robot: nRobot, keys: nKeys, dist} of keyNeighbours(map, robots[ri], keys)) {
        const nRobots = [...robots];
        nRobots[ri] = nRobot;
        result.push({
          state: {robots: nRobots, keys: nKeys},
          dist,
        });
      }
    }
    return result;
  }

  function getIsTarget(map: Map) {
    const keyIndices = [...new Set(map.join("").match(/[a-z]/g))]
      .map(k => k.charCodeAt(0) - "a".charCodeAt(0));
    return ({keys}: State) => keyIndices.every(ki => keys[ki]);
  }

  interface StateWithDist {
    readonly state: State;
    readonly dist: number;
  }

  class PriorityQueue {

    private readonly items: StateWithDist[] = [];

    add(item: StateWithDist) {
      const higherIndex = this.items.findIndex(i => i.dist > item.dist);
      if (higherIndex < 0)
        this.items.push(item);
      else
        this.items.splice(higherIndex, 0, item);
    }

    getMin() {
      const min = this.items.shift();
      if (!min)
        throw new Error();
      return min;
    }

    isEmpty() {
      return !this.items.length;
    }

  }

  function countSteps(map: Map) {
    function getKey({robots, keys}: State) {
      return [robots, keys.join("")].join(",");
    }
    const isTarget = getIsTarget(map);
    const dists = new Map<string, number>();
    const startState = getStartState(map);
    dists.set(getKey(startState), 0);
    const q = new PriorityQueue();
    q.add({state: startState, dist: 0});
    while (!q.isEmpty()) {
      const {state, dist} = q.getMin();
      if (isTarget(state)) {
        log(dist);
        return;
      }
      for (const n of neighbours(map, state)) {
        const alt = dist + n.dist;
        const key = getKey(n.state);
        let prevDist = dists.get(key);
        if (prevDist === undefined)
          prevDist = Number.POSITIVE_INFINITY;
        if (alt < prevDist) {
          dists.set(key, alt);
          q.add({state: n.state, dist: alt});
        }
      }
    }
  }

  function splitMap(map: Map): Map {
    let x = 0;
    const y = map.findIndex(r => {
      x = r.indexOf("@");
      return x >= 0;
    });
    if (y < 0)
      throw new Error();
    const newMap = [...map];
    for (const cy of [y - 1, y + 1]) {
      const r = map[cy];
      newMap[cy] = r.slice(0, x - 1) + "@#@" + r.slice(x + 2);
    }
    const r = map[y];
    newMap[y] = r.slice(0, x - 1) + "###" + r.slice(x + 2);
    return newMap;
  }

  const map = splitMap(INPUT.split("\n"));
  log(map.join("\n"));
  log(countSteps(map));
}

export const run = run2;

const INPUTS = `
#######
#a.#Cd#
##...##
##.@.##
##...##
#cB#Ab#
#######

#################################################################################
#.......#....f........#............c....#.........................#.....#.......#
#.#####.#.###.#########.#######.#######.#.#.#####################.#.###.#.#.###.#
#...#...#.#...#...........#.....#.......#.#l#.....#.....#.......#...#...#.#...#r#
###.#.#.#.#.#.#.###########.#####.#######.###.###.#.###.###.#########.#######.#.#
#...#.#.#.#.#.#.......#...#.#...#.#.....#..o..#.#.#...#...#.........#.........#.#
#.###.#.#.#.###.#######.#.#.###.#.###.#.#.#####.#.#.#####.#.#####.#.###########.#
#...#.#.#.#.....#.......#...#...#.....#.#.#.....#.H.#.....#.#...#.#.........#...#
#.###.#.#.#######.###########.#########.#.#####.#####.#####.#.###.#########.#.###
#.#...#.#...#.#...#...............#.....#...#.......#.....#.#...#.....#.....#...#
#.#.#######.#.#.###.#########.###.#.#######.#.#####.#####.#.###.#####.###.#####.#
#.#..q....#.#.#...#...#.....#...#...#...#...#...#...#...#.#.....#...#...#.#...#.#
#.#######.#.#.###.###.#.###.#######.#.###.#####.#.###.#.#.#####.#K#####.###.#.#.#
#.......#.#.....#...#.#.#.#.#.....#.#...#.......#...#.#.#.#.....#.#.N...#...#...#
###.#####.#####.###.###.#.#.#.###.#.###.#####.#######.#.#.#.#####.#.###.#.#######
#...#.....#.#.....#.#...#.....#.#.#...#.#...#.#.....#.#...#.......#...#.#.......#
#####.###.#.#.#####.#.#########.#.###.#.#.###.#.###.#.#########.#####.#.#######.#
#.....#...#.#.#.....#.....#.....#.#...#.#.#...#.#.....#...#.....#.....#.....#.#.#
#.#####.###.#.#.#.#######.#.###.#.#.###.#.#.###.#.#####.#.#.#####.#########.#.#.#
#...#.......#.#.#.#.......#.#...#.#.....#...#...#...#...#.#.....#...S.#.....#.#.#
#.#.#########.#.###.#######.#.###.#######.###.#######.###.#####.#####.#.#####.#.#
#n#.#..s......#.#...#.....#.#...#...#...#.#...#.....#.#.#.....#....v#.#.......#.#
#.#.#.#########.#.#.#####.#####.###.#.#.#.#.###.###.#.#.###########.#.#########M#
#.#...#.#.....#.#.#...#.#.#.......#...#.#.#...#.#.#.#.#.........#...#.....#.....#
#.#####.#.###.#.#.###.#.#.#.###########.#####.#.#.#.#.###E###.#.#.#######.#.#####
#...#...#...#...#...#...#.#...#.........#.....#.#.#.#...#.#.#.#.#...#...#...#...#
###.#.#.###.#######.#####.###.#.#########.###.#.#.#.###.#.#.#.#####.###.#####.#.#
#.#.#.#...#...#...#.......#..w#.........#.#...#...#...#.#...#...#...#...Z.#...#.#
#.#.#.###.###.#.#.#########.###########.#.#J###.###.###.#######.#.###.###.#.###.#
#.#.#...#...#...#.....#.......#.....#...#.#.#...#...#...#a....#.#.....#...#.#.#.#
#.#.#####.#.#######.###.#####.#.###.#.###.#.#.###.###.###.###.#.#######.###X#.#.#
#.#.....#.#.......#...#...#.#...#...#...#.#.#.#.#.....#.....#.....#...#.....#.#.#
#.#####.#.###########.###.#.#####.#.###.#.#.#.#.#######.###.#####.#.#########.#.#
#.......#.#.............#...#...#.#.#...#.#.#.#...#.......#.#...#.#.#.....#.#.D.#
#.#######.#.#####.#########.#.#.#.###.###.###.#.#.#######.#.#I#.#A#.#.#.#.#.#.###
#.#.......#.#.....#...#...#...#.#.....#.#...#...#.....#...#...#.#...#.#.#..t#.#.#
#.#######.#.#.#####.#.#.#.#####.#######.#.#.#########.###.#####.#####.#.#####.#.#
#.........#.#...#...#.#.#b......#...#...#.#.........#...#...#..i#...#.#.....#.#.#
#########.#.#####.###.#.#########.#.#.#.#.#.###########.###.#.###.#.#.#####.#.#.#
#...G.....#.........#.............#...#...#.............#e..#...T.#.......#y....#
#######################################.@.#######################################
#.#.....#.............#.....#...............#.......#.....#...#.................#
#.#.#.###.#.#########.#U###.#####.#####.#.#.#.#####.#.###.###.#.###############.#
#.#.#.....#.#.........#...#.#...#.#...#.#.#...#...#...#.#...#...#...........#...#
#.#.#######.#####.#######.#.#.#.###.#.#.#.#######.#####.###.#####.#########.#.#.#
#.#.....#.#.....#...#.....#...#.....#.#.#.#.....#...#.............#.......#u#.#.#
#.#####.#.#####.###.#.###############.#.#.#.###.#.###B#################.#.#.#.#.#
#.#...#...#...#.#.....#...#..x..#...#.#.#.#.#.#.#.......#...........#...#.#...#.#
#.#.#.###.#.###.#.#####.#.#.###.###.#.#.#.#.#.#.###.#####.#########.#.#########.#
#.#.#.......#...#.#...#.#...#.#...#...#.#.#...#...#...#...#.....#...#.........#.#
#.#.#########.#####.#.#.#####.###.#.###.#.###.###.#####.###.###.#.#####.#.#.###.#
#.....#.......#...#.#z#.#.....#...#...#.#...#...#...........#...#.....#.#.#.#...#
#.#####.#####.#.#.#V#.#.#.###.#.#####.#.#.#.#.#######.###############.#.#.###.###
#...#...#.#...#.#.#.#...#...#.#d..#.#.#.#j#...#.....#...#.......#.....#g#.Q.#...#
#####.###.#.###.#.#.#####.#.#.###.#.#.#.#.#####.###.#####.#####.#.#########.###.#
#.....#.....#.#.#...#.....#.#...#.#.#...#...#.#.#.#.#.....#...#...#.........#...#
#.#####.#####.#.###########.#####.#.###.###.#.#.#.#.#.#####.#.#########.#####.###
#.....#.....L.#.#...........#...#.#.....#...#.#.#.#.#.#...#.#...........#.....#.#
#.###.#####.###.#####.#######.#.#.#.#####.###.#.#.#.#.#.#.#.#.#########.#.#####.#
#...#...P.#.#...#.....#.Y...#.#...#...#.#.#...#.#.....#.#.#.#.........#.#.......#
#.#######.#.#.###.#.###.###.#.#######.#.#.###.#.#.#######.#.###.#####.#########.#
#.#.....#.#.#.#...#.#...#.#...#.....#...#...#.#.#.#.....#...#.#.#...#.....#.#...#
#.#.###.#.#.#.#.###.#####.#####.###.###.###.#.#.###.###.#####.###.#.###.#.#.#.###
#.#...#...#.#..k#.#.......#...#.#...#...#...#.#.......#.....#.....#.#...#...#.#.#
#.###.###########.#######.#.#.#.###.#.###.###.#########.###.#######.#.#####.#.#.#
#.#.#.........#.......#...#.#.#...#.#...#.#...#.......#.#.......#...#...#...#...#
#.#.#########.#.#####.#.###.#.###.#####.#.###.#.#####.#.#.#######.#####.###.###.#
#.#.........#.#.#...#.#.....#...#.......#.....#.#.#...#.#.#.......#...#...#.#.O.#
#.#######.#.#.#.###.#.#########.#.#########.###.#.#.#####.#.#######.#.###.###.###
#...#.....#.#.#.....#...#.......#.#.....#...#...#.#.......#.#...#...#...#.#...#.#
###.#.#####.#.#####.#.###.#######.###.###.###.###.###.#####.#.#.###.###.#.#.###.#
#.#...#.#...#.......#...#...#...#...#...#...#...#.....#.....#.#...#.#.....#.#...#
#.#####.#.#############.###.#.#.###.###.#######.#####.#.#####.###.#.#####.#.#.#.#
#...#...#.....#.#.......#...#.#.#...#...#.......#...#.#.#...#...#.#...#...#.#p#.#
#.###.#.#####.#.#.###.###.###.#.#.###.###.#######F#.###.#.#.###.#.###.#.###.#.###
#.#...#.....#.#.#.#...#...#...#.#...#...#.........#.....#.#.....#.....#...#.#...#
#.#.###.#####.#.#.#####.###.#W#####.#.#.#################.#####.###########.###.#
#m#...#.#.....#.#.#.....#.#h#.#.....#.#.#.....#.....#...#...#...#.........#.....#
#.###.#.#R#####.#.#.#####.#.#.#.#######.#.###.#.###.#.#C#.#.#####.#######.#####.#
#.....#.........#...#.......#...........#...#.....#...#...#.............#.......#
#################################################################################
`.split("\n\n");

const INPUT = INPUTS[1];
