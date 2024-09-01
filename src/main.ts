import { run } from "./core/runtime";
import { browserEngine } from "./engines/browser_engine";
// import { terminalEngine } from "./engines/terminal_engine";
import "./style.css";

function main() {
  browserEngine.setup();
  run(browserEngine);

  // terminalEngine.setup();
  // run(terminalEngine);
}

main();
