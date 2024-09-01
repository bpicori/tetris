import { Engine, Global } from "../core/runtime";
import { Move } from "../core/tetris";
import { safeAccess, Vector2 } from "../core/utils";
import * as readline from "readline";

const GLOBALS: Global = {
  boardSize: { width: 10, height: 20 },
  cellSize: 1,
  speed: 500,
};

const BLOCK_CHAR = "▀";
const EMPTY_CHAR = ".";

let board: string[][] = [];

const drawBoard = () => {
  const output = board.map((row) => row.join("")).join("\n");
  console.log(output);
};

const clearConsole = () => {
  process.stdout.write("\x1b[2J\x1b[0f");
};

const setupInputListeners = (callback: (move: Move) => void) => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (_, key) => {
    if (key.ctrl && key.name === "c") {
      process.exit();
    } else {
      switch (key.name) {
        case "left":
          callback(Move.Left);
          break;
        case "right":
          callback(Move.Right);
          break;
        case "down":
          callback(Move.Down);
          break;
        case "up":
          callback(Move.Rotate);
          break;
      }
    }
  });
};

export const terminalEngine: Engine = {
  setup: () => {
    clearConsole();
    console.log("Tetris game started. Use arrow keys to play.");
  },

  clearAll: clearConsole,

  clearCell: ([x, y]: Vector2) => {
    safeAccess(board, y, x) && (board[y][x] = EMPTY_CHAR);
  },

  drawEmptyCell: ([x, y]: Vector2) => {
    safeAccess(board, y, x) && (board[y][x] = EMPTY_CHAR);
  },

  drawCell: ([x, y]: Vector2) => {
    safeAccess(board, y, x) && (board[y][x] = BLOCK_CHAR);
  },

  globals: () => GLOBALS,

  onMove: (callback: (move: Move) => void) => {
    setupInputListeners(callback);
  },

  requestAnimationFrame: (callback: (time: number) => void) => {
    return setInterval(() => {
      callback(Date.now());
      clearConsole();
      drawBoard();
    }, GLOBALS.speed) as any;
  },

  cancelAnimationFrame: (id: number) => {
    clearInterval(id);
  },

  drawGameOverScreen: () => {
    console.log("Game Over");
  },
  getEmptyCell: () => EMPTY_CHAR,
  getSupportedColors: () => ["red", "green", "blue"],
};
