const OUTPUT = document.createElement("div");
document.body.appendChild(OUTPUT);
OUTPUT.style.fontFamily = "Monaco, Consolas, monospace";
OUTPUT.style.whiteSpace = "pre";
OUTPUT.style.fontSize = "0.6em";

function format(args: unknown[]) {
  if (args.length === 1 && typeof args[0] === "string")
    return args[0];
  return args.map(a => JSON.stringify(a)).join(", ");
}

export function log(...args: unknown[]) {
  const line = document.createElement("div");
  line.innerText = format(args);
  OUTPUT.appendChild(line);
}

export function clearLog() {
  OUTPUT.innerText = "";
}
