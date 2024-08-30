import { IShape } from "./shapes/Ishape";
import { Board } from "./shapes/tetromino";
import { Vector2 } from "./utils";

export enum Color {
  Red = "red",
  Blue = "blue",
  Green = "green",
  Yellow = "yellow",
  Purple = "purple",
  Orange = "orange",
  Cyan = "cyan",
  White = "white",
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

// export const BOARD_WIDTH = 10;
// export const BOARD_HEIGHT = 20;

export const createEmptyBoard = (board: Board): Color[][] =>
  Array(board.height)
    .fill(null)
    .map(() => Array(board.width).fill(Color.White));

export const init = (board: Board): GameState => {
  return {
    board: createEmptyBoard(board),
    tetromino: IShape.shape,
    tetrominoColor: Color.Red,
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
    state.tetromino = IShape.shape;
  }

  return { ...state };
};
