import { BoardSize } from "./shapes/tetromino";
import { Color, init, Move, update } from "./tetris";
import { Vector2 } from "./utils";

export interface Global {
  boardSize: BoardSize;
  cellSize: number;
  speed: number;
}

export interface Engine {
  clearAll(): void;
  clearCell(vec: Vector2): void;
  drawEmptyCell(vec: Vector2): void;
  drawCell(vec: Vector2, color: Color): void;
  globals(): Global;
  onMove(callback: (move: Move) => void): void;
  requestAnimationFrame(callback: (time: number) => void): number;
  cancelAnimationFrame(id: number): void;
}

export const run = (engine: Engine) => {
  const moveQueue: Move[] = [];

  engine.onMove((move) => {
    moveQueue.push(move);
  });

  engine.clearAll();

  const boardSize = engine.globals().boardSize;
  let state = init(boardSize);

  const gameLoop = (time: number) => {
    const move = moveQueue.shift();
    const newState = update(
      state,
      time,
      boardSize,
      engine.globals().speed,
      move
    );

    console.log(newState);

    state = newState;

    // Clear the board
    for (let y = 0; y < boardSize.height; y++) {
      for (let x = 0; x < boardSize.width; x++) {
        engine.clearCell([x, y]);
      }
    }

    // Draw the board
    for (let y = 0; y < boardSize.height; y++) {
      for (let x = 0; x < boardSize.width; x++) {
        const color = state.board[y][x];
        if (color === Color.White) {
          engine.drawEmptyCell([x, y]);
        } else {
          engine.drawCell([x, y], color);
        }
      }
    }

    // Draw the current tetromino
    const tetrominoCells = state.tetrominoCells;
    const tetrominoColor = state.tetrominoColor;

    for (const [x, y] of tetrominoCells) {
      engine.drawCell([x, y], tetrominoColor);
    }

    if (!state.gameOver) {
      engine.requestAnimationFrame(gameLoop);
    } else {
      console.log("Game Over!");
    }
  };

  engine.requestAnimationFrame(gameLoop);
};
