import { run } from "./core/runtime.js";
import { terminalEngine } from "./engines/terminal_engine.js";

function main() {
  terminalEngine.setup();
  run(terminalEngine);
}

main();
