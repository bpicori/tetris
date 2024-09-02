import { BoardSize } from "./shapes/tetromino";
import { init, Move, update } from "./tetris";
import { Vector2 } from "./utils";

export interface Global {
  boardSize: BoardSize;
  cellSize: number;
  speed: number;
}

export interface Engine {
  setup(): void;
  clearAll(): void;
  clearCell(vec: Vector2): void;
  drawEmptyCell(vec: Vector2): void;
  drawCell(vec: Vector2, color: string): void;
  globals(): Global;
  requestAnimationFrame(callback: (time: number) => void): void;
  cancelAnimationFrame(id: number): void;
  drawGameOverScreen(): void;
  getSupportedColors(): string[];
  getEmptyCell(): string;
  moveQueue(): Move[];
}

export const run = (engine: Engine) => {
  engine.clearAll();

  const boardSize = engine.globals().boardSize;
  let state = init(
    boardSize,
    engine.getSupportedColors(),
    engine.getEmptyCell()
  );

  const gameLoop = (time: number) => {
    if (state.gameOver) {
      engine.clearAll();
      engine.drawGameOverScreen();
      return;
    }

    const move = engine.moveQueue().shift();
    const newState = update(state, time, engine.globals().speed, move);

    state = newState;

    // Clear
    for (let y = 0; y < boardSize.height; y++) {
      for (let x = 0; x < boardSize.width; x++) {
        engine.clearCell([x, y]);
      }
    }

    // Draw board
    for (let y = 0; y < boardSize.height; y++) {
      for (let x = 0; x < boardSize.width; x++) {
        const color = state.board[y][x];
        if (color === engine.getEmptyCell()) {
          engine.drawEmptyCell([x, y]);
        } else {
          engine.drawCell([x, y], color);
        }
      }
    }

    // Draw tetromino
    const tetrominoCells = state.tetrominoCells;
    const tetrominoColor = state.tetrominoColor;

    for (const [x, y] of tetrominoCells) {
      engine.drawCell([x, y], tetrominoColor);
    }

    engine.requestAnimationFrame(gameLoop);
  };

  engine.requestAnimationFrame(gameLoop);
};
