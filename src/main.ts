import { run } from "./core/runtime";
import { browserEngine, setupCanvas } from "./engines/browser_engine";
import "./style.css";

function main() {
  setupCanvas();
  run(browserEngine);
}

main();
