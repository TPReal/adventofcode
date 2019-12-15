const OUTPUT = document.createElement("div");
document.body.appendChild(OUTPUT);
OUTPUT.style.fontFamily = "Monaco, Consolas, monospace";
OUTPUT.style.whiteSpace = "pre";

function format(args: unknown[]) {
  if (args.length === 1 && typeof args[0] === "string")
    return args[0];
  return args.map(a => JSON.stringify(a)).join(", ");
}

export function log(...args: unknown[]) {
  OUTPUT.innerText += format(args) + "\n";
}

export function clearLog() {
  OUTPUT.innerText = "";
}
