import { Engine, Global } from "../core/runtime";
import { Move } from "../core/tetris";
import * as readline from "readline";

const GLOBALS: Readonly<Global> = {
  boardSize: { width: 20, height: 20 },
  speed: 500,
  cellSize: 1,
};

const MoveQueue: Move[] = [];

const EMPTY_CHAR = "·";
const FILLED_CHAR = "█";
const BOX = {
  topLeft: "┌",
  topRight: "┐",
  bottomLeft: "└",
  bottomRight: "┘",
  horizontal: "─",
  vertical: "│",
} as const;

let gameBoard: string[][];
let lastRenderedBoard: string = "";

const createEmptyBoard = (width: number, height: number): string[][] =>
  Array(height)
    .fill(null)
    .map(() => Array(width).fill(EMPTY_CHAR));

const renderRow = (row: string[]): string =>
  `${BOX.vertical}${row.join("")}${BOX.vertical}`;

const getTerminalSize = (): { width: number; height: number } => ({
  width: process.stdout.columns,
  height: process.stdout.rows,
});

const centerText = (text: string, width: number): string => {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text;
};

const renderBoard = (board: string[][]): string[] => {
  const { width } = GLOBALS.boardSize;
  const topBorder = `${BOX.topLeft}${BOX.horizontal.repeat(width)}${
    BOX.topRight
  }`;
  const bottomBorder = `${BOX.bottomLeft}${BOX.horizontal.repeat(width)}${
    BOX.bottomRight
  }`;
  return [topBorder, ...board.map(renderRow), bottomBorder];
};

const clearConsole = (): void => {
  process.stdout.write("\x1b[2J\x1b[H"); // clear screen and move cursor to 1,1
};

const hideCursor = (): void => {
  process.stdout.write("\x1b[?25l");
};

const showCursor = (): void => {
  process.stdout.write("\x1b[?25h");
};

const moveCursor = (x: number, y: number): void => {
  process.stdout.write(`\x1b[${y};${x}H`);
};

const displayBoard = (board: string[][]): void => {
  const { width, height } = getTerminalSize();
  const renderedBoard = renderBoard(board);
  const verticalPadding = Math.max(
    0,
    Math.floor((height - renderedBoard.length) / 2)
  );
  const centeredBoard = renderedBoard.map((line) => centerText(line, width));

  const output = [
    "\x1b[H", // Move cursor to home position
    "\n".repeat(verticalPadding),
    ...centeredBoard,
  ].join("\n");

  process.stdout.write(output);
};

const setupInputListeners = (): void => {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.on("keypress", (_, key) => {
    if (key.ctrl && key.name === "c") {
      showCursor();
      process.exit();
    } else {
      const moveMap: { [key: string]: Move } = {
        left: Move.Left,
        right: Move.Right,
        down: Move.Down,
        up: Move.Rotate,
      };
      const move = moveMap[key.name];
      if (move) MoveQueue.push(move);
    }
  });
};

const renderLoop = (): void => {
  const renderedBoard = renderBoard(gameBoard).join("\n");
  if (renderedBoard !== lastRenderedBoard) {
    displayBoard(gameBoard);
    lastRenderedBoard = renderedBoard;
  }
  setTimeout(renderLoop, GLOBALS.speed);
};

export const terminalEngine: Engine = {
  moveQueue: () => MoveQueue,
  setup: () => {
    clearConsole();
    hideCursor();
    gameBoard = createEmptyBoard(
      GLOBALS.boardSize.width,
      GLOBALS.boardSize.height
    );
    setupInputListeners();
  },
  clearAll: () => {
    gameBoard = createEmptyBoard(
      GLOBALS.boardSize.width,
      GLOBALS.boardSize.height
    );
  },
  clearCell: ([x, y]) => {
    if (y >= 0 && y < gameBoard.length && x >= 0 && x < gameBoard[y].length) {
      gameBoard[y][x] = EMPTY_CHAR;
    }
  },
  drawEmptyCell: ([x, y]) => {
    if (y >= 0 && y < gameBoard.length && x >= 0 && x < gameBoard[y].length) {
      gameBoard[y][x] = EMPTY_CHAR;
    }
  },
  drawCell: ([x, y]) => {
    if (y >= 0 && y < gameBoard.length && x >= 0 && x < gameBoard[y].length) {
      gameBoard[y][x] = FILLED_CHAR;
    }
  },
  globals: () => GLOBALS,
  requestAnimationFrame: (callback: (time: number) => void) => {
    displayBoard(gameBoard);

    setTimeout(() => {
      callback(Date.now());
    }, 1);
  },
  cancelAnimationFrame: (id: number) => {},
  drawGameOverScreen: () => {
    clearConsole();
    console.log("Game Over");
  },
  getEmptyCell: () => EMPTY_CHAR,
  getSupportedColors: () => [],
};
