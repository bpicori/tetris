// import { Engine, Global } from "../core/runtime";
// import { Color, Move } from "../core/tetris";
// import { Vector2 } from "../core/utils";
// import * as readline from "readline";

// const CELL_CHARS: Record<Color, string> = {
//   [Color.Cyan]: "□",
//   [Color.Purple]: "■",
//   [Color.Red]: "▣",
//   [Color.DarkOrange]: "▤",
//   [Color.SandyBrown]: "▥",
//   [Color.DarkGreen]: "▦",
//   [Color.Blue]: "▧",
//   [Color.DarkPurple]: "▨",
//   [Color.Navy]: "▩",
//   [Color.DarkMediumBlue]: "▬",
//   [Color.Salmon]: "▭",
//   [Color.Orange]: "▮",
//   [Color.Yellow]: "▯",
//   [Color.Green]: "▰",
//   [Color.White]: "·",
// };

// const GLOBALS: Global = {
//   boardSize: { width: 10, height: 20 },
//   cellSize: 1,
//   speed: 500,
// };

// let board: string[][] = [];

// const clearConsole = () => {
//   console.clear();
// };

// const drawBoard = () => {
//   const output = board.map((row) => row.join("")).join("\n");
//   console.log(output);
// };

// const setupInputListeners = (callback: (move: Move) => void) => {
//   readline.emitKeypressEvents(process.stdin);
//   process.stdin.setRawMode(true);

//   process.stdin.on("keypress", (_, key) => {
//     if (key.ctrl && key.name === "c") {
//       process.exit();
//     } else {
//       switch (key.name) {
//         case "left":
//           callback(Move.Left);
//           break;
//         case "right":
//           callback(Move.Right);
//           break;
//         case "down":
//           callback(Move.Down);
//           break;
//         case "up":
//           callback(Move.Rotate);
//           break;
//       }
//     }
//   });
// };

// export const terminalEngine: Engine = {
//   setup: () => {
//     clearConsole();
//     console.log("Tetris game started. Use arrow keys to play.");
//     board = Array(GLOBALS.boardSize.height)
//       .fill(null)
//       .map(() => Array(GLOBALS.boardSize.width).fill(CELL_CHARS[Color.White]));
//   },
//   clearAll: () => {
//     board = board.map((row) => row.map(() => CELL_CHARS[Color.White]));
//     clearConsole();
//   },

//   clearCell: ([x, y]: Vector2) => {
//     board[y][x] = CELL_CHARS[Color.White];
//   },
//   drawEmptyCell: ([x, y]: Vector2) => {
//     board[y][x] = CELL_CHARS[Color.White];
//   },

//   drawCell: ([x, y]: Vector2, color: Color) => {
//     board[y][x] = CELL_CHARS[color];
//   },

//   globals: () => GLOBALS,

//   onMove: (callback: (move: Move) => void) => {
//     setupInputListeners(callback);
//   },

//   requestAnimationFrame: (callback: (time: number) => void) => {
//     return setInterval(() => {
//       callback(Date.now());
//       clearConsole();
//       drawBoard();
//     }, GLOBALS.speed) as unknown as number;
//   },

//   cancelAnimationFrame: (id: number) => {
//     clearInterval(id);
//   },

//   drawGameOverScreen: () => {
//     console.log("Game Over");
//   },
// };
