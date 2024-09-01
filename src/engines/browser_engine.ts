import { Engine } from "../core/runtime";
import { Move } from "../core/tetris";

const GLOBALS = {
  boardSize: {
    width: 10,
    height: 20,
  },
  cellSize: 20,
  speed: 500,
};

const Colors: string[] = [
  "#01EDFA", // Cyan
  "#DD0AB2", // Purple
  "#EA141C", // Red
  "#FE4819", // DarkOrange
  "#FF910C", // SandyBrown
  "#39892F", // DarkGreen
  "#0077D3", // Blue
  "#78256F", // DarkPurple
  "#2E2E84", // Navy
  "#485DC5", // DarkMediumBlue
  "#FD3F59", // Salmon
  "#FFC82E", // Orange
  "#FEFB34", // Yellow
  "#53DA3F", // Green
];

const EMPTY_CELL = "#FFFFFF";

function getCanvas(): HTMLCanvasElement {
  const canvas = document.getElementById("tetris") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error("Canvas element not found");
  }
  return canvas;
}

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context is null");
  }
  return ctx;
}

function setupInputListeners() {
  const cellSizeInput = document.getElementById(
    "cell-size"
  ) as HTMLInputElement;
  const rowsInput = document.getElementById("rows") as HTMLInputElement;
  const colsInput = document.getElementById("cols") as HTMLInputElement;
  const speedInput = document.getElementById("speed") as HTMLInputElement;

  cellSizeInput.addEventListener("change", () => {
    GLOBALS.cellSize = parseInt(cellSizeInput.value);
    browserEngine.setup();
  });

  rowsInput.addEventListener("change", () => {
    GLOBALS.boardSize.height = parseInt(rowsInput.value);
    browserEngine.setup();
  });

  colsInput.addEventListener("change", () => {
    GLOBALS.boardSize.width = parseInt(colsInput.value);
    browserEngine.setup();
  });

  speedInput.addEventListener("change", () => {
    GLOBALS.speed = parseInt(speedInput.value);
  });
}

export const browserEngine: Engine = {
  setup: () => {
    const canvas = getCanvas();
    canvas.width = GLOBALS.boardSize.width * GLOBALS.cellSize;
    canvas.height = GLOBALS.boardSize.height * GLOBALS.cellSize;

    setupInputListeners();
  },
  clearAll: () => {
    const canvas = getCanvas();
    const ctx = getContext(canvas);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  clearCell: (vec) => {
    const canvas = getCanvas();
    const ctx = getContext(canvas);
    const cellSize = GLOBALS.cellSize;
    ctx.clearRect(vec[0] * cellSize, vec[1] * cellSize, cellSize, cellSize);
  },
  drawEmptyCell: (vec) => {
    const canvas = getCanvas();
    const ctx = getContext(canvas);
    const cellSize = GLOBALS.cellSize;
    ctx.fillStyle = "black";
    ctx.fillRect(
      vec[0] * cellSize + cellSize / 2 - 1,
      vec[1] * cellSize + cellSize / 2 - 1,
      2,
      2
    );
  },
  drawCell: (vec, color) => {
    const canvas = getCanvas();
    const ctx = getContext(canvas);
    const cellSize = GLOBALS.cellSize;
    ctx.fillStyle = color;
    ctx.fillRect(vec[0] * cellSize, vec[1] * cellSize, cellSize, cellSize);
  },
  globals: () => GLOBALS,
  onMove: (callback) => {
    document.addEventListener("keydown", (event) => {
      let move: Move | undefined;
      switch (event.key) {
        case "ArrowUp":
          move = Move.Rotate;
          break;
        case "ArrowLeft":
          move = Move.Left;
          break;
        case "ArrowRight":
          move = Move.Right;
          break;
        case "ArrowDown":
          move = Move.Down;
          break;
      }
      if (move !== undefined) {
        callback(move);
      }
    });
  },
  requestAnimationFrame: (callback) => {
    return window.requestAnimationFrame(callback);
  },
  cancelAnimationFrame: (id) => {
    window.cancelAnimationFrame(id);
  },

  drawGameOverScreen: () => {
    const canvas = getCanvas();
    const ctx = getContext(canvas);

    ctx.fillStyle = "black";
    ctx.font = "40px serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  },
  getSupportedColors: () => Colors,
  getEmptyCell: () => EMPTY_CELL,
};
