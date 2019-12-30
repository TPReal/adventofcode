interface Options {
  font: string;
  size: number | string;
  wrap: boolean;
}

export type PartialOptions = Partial<Options>;

const DEFAULT_OPTIONS: Options = {
  font: "Monaco, Consolas, monospace",
  size: 9,
  wrap: false,
};

const LOG = document.createElement("div");
document.body.appendChild(LOG);

function applyOptions(logElem: HTMLElement, {font, size, wrap}: PartialOptions) {
  if (font !== undefined)
    logElem.style.fontFamily = font;
  if (size !== undefined)
    logElem.style.fontSize = typeof size === "number" ? `${size}px` : size;
  if (wrap !== undefined)
    logElem.style.whiteSpace = wrap ? "pre-wrap" : "pre";
}

function applyOptionsInherit(logElem: HTMLElement) {
  logElem.style.fontFamily = "inherit";
  logElem.style.fontSize = "inherit";
  logElem.style.whiteSpace = "inherit";
}

function format(args: unknown | unknown[]) {
  const argsArray = Array.isArray(args) ? args : [args];
  if (argsArray.length === 1 && typeof argsArray[0] === "string")
    return argsArray[0];
  return argsArray.map(a => JSON.stringify(a)).join(", ");
}

class LogLine {

  protected constructor(readonly elem: HTMLElement) {
  }

  static create(options: Options) {
    const elem = document.createElement("div");
    LOG.appendChild(elem);
    return new LogLine(elem);
  }

  set text(args: unknown | unknown[]) {
    this.elem.innerText = format(args);
  }

  setText(...args: unknown[]) {
    this.text = args;
  }

  set options(opts: PartialOptions) {
    applyOptions(this.elem, opts);
  }

  delete() {
    this.elem.remove();
  }

}

export interface Log {

  (...args: unknown[]): LogLine;

  input(): Promise<string>;

  setOptions(opts: PartialOptions): void;

  clear(): void;

}

const currentOptions: Options = {...DEFAULT_OPTIONS};

function logFunc(...args: unknown[]) {
  const line = LogLine.create({...currentOptions});
  line.text = args;
  line.options = currentOptions;
  return line;
}

logFunc.setOptions = (opts: PartialOptions) => {
  Object.assign(currentOptions, opts);
}

logFunc.input = () => {
  const logLine = logFunc();
  const prompt = document.createElement("span");
  logLine.elem.appendChild(prompt);
  prompt.innerText = "?> ";
  prompt.style.fontStyle = "italic";
  const input = document.createElement("input");
  logLine.elem.appendChild(input);
  applyOptionsInherit(input);
  input.style.padding = "0";
  return new Promise<string>(resolve => {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
        resolve(input.value);
        input.replaceWith(input.value);
      }
    });
  });
}

logFunc.clear = () => {
  LOG.innerText = "";
};

export const log: Log = logFunc;
