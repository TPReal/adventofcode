const OUTPUT = document.createElement("div");
document.body.appendChild(OUTPUT);
OUTPUT.style.fontFamily = "Monaco, Consolas, monospace";
OUTPUT.style.whiteSpace = "pre";

export function log(...args: unknown[]) {
  OUTPUT.innerText += args.join(" ") + "\n";
}
