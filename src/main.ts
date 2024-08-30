import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  GameState,
  init,
  Move,
  update,
} from "./core/tetris";
import "./style.css";

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
      if (color === "white") {
        ctx.fillStyle = "black";
        ctx.fillRect(
          x * cellSize + cellSize / 2 - 1,
          y * cellSize + cellSize / 2 - 1,
          1,
          1
        );
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

async function main() {
  // init game loop
  let state = init();
  let lastTime = 0;
  let eventQueue: Move[] = [];
  // set canvas size

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      eventQueue.push(Move.Rotate);
    }

    if (event.key === "ArrowLeft") {
      eventQueue.push(Move.Left);
    }

    if (event.key === "ArrowRight") {
      eventQueue.push(Move.Right);
    }

    if (event.key === "ArrowDown") {
      eventQueue.push(Move.Down);
    }
  });

  const canvas = document.getElementById("tetris") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  // set canvas size
  const cellSize = 20;
  const width = BOARD_WIDTH * cellSize;
  const height = BOARD_HEIGHT * cellSize;

  canvas.width = width;
  canvas.height = height;

  const loop = (time: number) => {
    if (!ctx) {
      throw new Error("Canvas context is null");
    }

    const move = eventQueue.shift();
    // update
    const newState = update(state, lastTime, time, move);
    state = newState;
    lastTime = time;

    // clear canvas
    clearCanvas(ctx);

    // draw grid
    renderBoard(ctx, state);

    // schedule next frame
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

main();
