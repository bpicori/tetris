import { IShape } from "./shapes/Ishape";
import { Oshape } from "./shapes/Oshape";
import { Board } from "./shapes/tetromino";
import { pickRandom, Vector2 } from "./utils";

export enum Color {
  Cyan = "#01EDFA",
  Purple = "#DD0AB2",
  Red = "#EA141C",
  DarkOrange = "#FE4819",
  SandyBrown = "#FF910C",
  DarkGreen = "#39892F",
  Blue = "#0077D3",
  DarkPurple = "#78256F",
  Navy = "#2E2E84",
  DarkMediumBlue = "#485DC5",
  Salmon = "#FD3F59",
  Orange = "#FFC82E",
  Yellow = "#FEFB34",
  Green = "#53DA3F",
  White = "#FFFFFF",
}

export enum Move {
  Left = "left",
  Right = "right",
  Down = "down",
  Rotate = "rotate",
}

export type GameState = {
  board: Color[][];
  tetromino: Vector2[];
  tetrominoColor: Color;
  score: number;
  time: number;
};

export const createEmptyBoard = (board: Board): Color[][] =>
  Array(board.height)
    .fill(null)
    .map(() => Array(board.width).fill(Color.White));

const pickRandomColor = (): Color =>
  pickRandom(Object.values(Color).filter((color) => color !== Color.White));

const pickRandomTetromino = (): Vector2[] => {
  const tetrominos = [IShape.shape, Oshape.shape];
  return pickRandom(tetrominos);
};

export const init = (board: Board): GameState => {
  return {
    board: createEmptyBoard(board),
    tetromino: pickRandomTetromino(),
    tetrominoColor: pickRandomColor(),
    score: 0,
    time: 0,
  };
};

export const update = (
  state: GameState,
  currentTime: number,
  board: Board,
  speed: number,
  move?: Move
): GameState => {
  if (move) {
    if (move === Move.Rotate) {
      state.tetromino = IShape.rotate(state.tetromino, board);
    } else {
      state.tetromino = IShape.move(state.tetromino, move, board);
    }
  }

  if (state.time === 0) {
    state.time = currentTime;
  }

  if (currentTime - state.time > speed) {
    state.time = currentTime;
    state.tetromino = IShape.move(state.tetromino, Move.Down, board);
  }

  // check if tetromino touches the board
  const isTouching = state.tetromino.some(([x, y]) => {
    if (y === board.height - 1) {
      return true;
    }

    return state.board[y + 1][x] !== Color.White;
  });

  if (isTouching) {
    state.tetromino.forEach(([x, y]) => {
      state.board[y][x] = state.tetrominoColor;
    });
    state.tetromino = pickRandomTetromino();
    state.tetrominoColor = pickRandomColor();
  }

  // detect if there is a full row
  const fullRows = state.board.reduce((acc, row, y) => {
    if (row.every((cell) => cell !== Color.White)) {
      acc.push(y);
    }

    return acc;
  }, [] as number[]);

  if (fullRows.length > 0) {
    fullRows.forEach((y) => {
      state.board.splice(y, 1);
      state.board.unshift(Array(board.width).fill(Color.White));
    });

    state.score += fullRows.length;
  }

  return { ...state };
};
