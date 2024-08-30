import { Color, GameState, init, Move, update } from "./core/tetris";
import "./style.css";

export const GLOBALS = {
  board: {
    width: 10,
    height: 20,
  },
  cellSize: 20,
  speed: 500,
  eventQueue: [] as Move[],
};

function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function renderBoard(ctx: CanvasRenderingContext2D, state: GameState) {
  const board = state.board;
  const boardWidth = board[0].length;
  const boardHeight = board.length;
  const cellSize = ctx.canvas.width / boardWidth;

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      const color = board[y][x];
      // if color is white, draw a dot
      if (color === Color.White) {
        ctx.fillStyle = "black";
        ctx.fillRect(
          x * cellSize + cellSize / 2 - 1,
          y * cellSize + cellSize / 2 - 1,
          1,
          1
        );
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // draw tetromino
  const tetromino = state.tetromino;
  const tetrominoColor = state.tetrominoColor;
  for (const [x, y] of tetromino) {
    ctx.fillStyle = tetrominoColor;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
}

function moveEvents() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      GLOBALS.eventQueue.push(Move.Rotate);
    }

    if (event.key === "ArrowLeft") {
      GLOBALS.eventQueue.push(Move.Left);
    }

    if (event.key === "ArrowRight") {
      GLOBALS.eventQueue.push(Move.Right);
    }

    if (event.key === "ArrowDown") {
      GLOBALS.eventQueue.push(Move.Down);
    }
  });
}

async function main() {
  // init game loop
  let state = init(GLOBALS.board);

  moveEvents();

  const canvas = document.getElementById("tetris") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context is null");
  }

  // set canvas size
  const width = GLOBALS.board.width * GLOBALS.cellSize;
  const height = GLOBALS.board.height * GLOBALS.cellSize;

  canvas.width = width;
  canvas.height = height;

  let animationFrameId: number;

  const loop = (time: number) => {
    const move = GLOBALS.eventQueue.shift();
    // update
    const newState = update(
      state,
      time,
      GLOBALS.board,
      GLOBALS.speed || 500,
      move
    );
    state = newState;

    // clear canvas
    clearCanvas(ctx);

    // draw grid
    renderBoard(ctx, state);

    // schedule next frame
    animationFrameId = requestAnimationFrame(loop);
  };

  const cellSizeInput = document.getElementById(
    "cell-size"
  ) as HTMLInputElement;

  cellSizeInput.addEventListener("change", (event) => {
    GLOBALS.cellSize = parseInt(cellSizeInput.value);

    canvas.width = GLOBALS.board.width * GLOBALS.cellSize;
    canvas.height = GLOBALS.board.height * GLOBALS.cellSize;
  });

  const rowsInput = document.getElementById("rows") as HTMLInputElement;
  rowsInput.addEventListener("change", (event) => {
    GLOBALS.board.height = parseInt(rowsInput.value);

    canvas.height = GLOBALS.board.height * GLOBALS.cellSize;

    state = init(GLOBALS.board);

    // clear requestAnimationFrame
    cancelAnimationFrame(animationFrameId);

    requestAnimationFrame(loop);
  });

  const colsInput = document.getElementById("cols") as HTMLInputElement;
  colsInput.addEventListener("change", (event) => {

    GLOBALS.board.width = parseInt(colsInput.value);
    GLOBALS.board.width = parseInt(colsInput.value);

    canvas.width = GLOBALS.board.width * GLOBALS.cellSize;

    state = init(GLOBALS.board);

    // clear requestAnimationFrame
    cancelAnimationFrame(animationFrameId);

    requestAnimationFrame(loop);
  });

  const speedInput = document.getElementById("speed") as HTMLInputElement;
  speedInput.addEventListener("change", (event) => {
    GLOBALS.speed = parseInt(speedInput.value);
  });

  requestAnimationFrame(loop);
}

main();
