import { Engine, Global } from "../core/runtime";
import { Move } from "../core/tetris";
import * as readline from "readline";

const GLOBALS: Readonly<Global> = {
  boardSize: { width: 20, height: 20 },
  speed: 500,
  cellSize: 1,
};

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
let moveCallback: ((move: Move) => void) | null = null;

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
  process.stdout.write("\x1b[2J");
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

  moveCursor(1, 1);
  process.stdout.write("\n".repeat(verticalPadding));
  centeredBoard.forEach((line) => {
    process.stdout.write(line + "\n");
  });
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
      if (move && moveCallback) moveCallback(move);
    }
  });
};

const renderLoop = (): void => {
  const renderedBoard = renderBoard(gameBoard).join("\n");
  if (renderedBoard !== lastRenderedBoard) {
    clearConsole();
    displayBoard(gameBoard);
    lastRenderedBoard = renderedBoard;
  }
  setTimeout(renderLoop, GLOBALS.speed);
};

export const terminalEngine: Engine = {
  setup: () => {
    clearConsole();
    hideCursor();
    gameBoard = createEmptyBoard(
      GLOBALS.boardSize.width,
      GLOBALS.boardSize.height
    );
    setupInputListeners();
    renderLoop();
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
  onMove: (callback: (move: Move) => void) => {
    moveCallback = callback;
  },
  requestAnimationFrame: (callback: (time: number) => void) => {
    return setInterval(
      () => callback(Date.now()),
      GLOBALS.speed
    ) as unknown as number;
  },
  cancelAnimationFrame: (id: number) => {
    clearInterval(id);
    showCursor();
  },
  drawGameOverScreen: () => {
    clearConsole();
    moveCursor(1, 1);
    console.log("Game Over");
    showCursor();
  },
  getEmptyCell: () => EMPTY_CHAR,
  getSupportedColors: () => ["red", "green", "blue"],
};
