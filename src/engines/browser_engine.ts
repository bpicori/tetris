import { Engine } from "../core/runtime";
import { Move } from "../core/tetris";

export const GLOBALS = {
  boardSize: {
    width: 10,
    height: 20,
  },
  cellSize: 20,
  speed: 500,
};

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

export function setupCanvas() {
  const canvas = getCanvas();
  canvas.width = GLOBALS.boardSize.width * GLOBALS.cellSize;
  canvas.height = GLOBALS.boardSize.height * GLOBALS.cellSize;
}

// function setupInputListeners() {
//   const cellSizeInput = document.getElementById(
//     "cell-size"
//   ) as HTMLInputElement;
//   const rowsInput = document.getElementById("rows") as HTMLInputElement;
//   const colsInput = document.getElementById("cols") as HTMLInputElement;
//   const speedInput = document.getElementById("speed") as HTMLInputElement;

//   cellSizeInput.addEventListener("change", () => {
//     GLOBALS.cellSize = parseInt(cellSizeInput.value);
//     setupCanvas();
//   });

//   rowsInput.addEventListener("change", () => {
//     GLOBALS.boardSize.height = parseInt(rowsInput.value);
//     setupCanvas();
//   });

//   colsInput.addEventListener("change", () => {
//     GLOBALS.boardSize.width = parseInt(colsInput.value);
//     setupCanvas();
//   });

//   speedInput.addEventListener("change", () => {
//     GLOBALS.speed = parseInt(speedInput.value);
//   });
// }

export const browserEngine: Engine = {
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
};
