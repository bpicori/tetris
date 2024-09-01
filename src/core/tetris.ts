import { IShape } from "./shapes/Ishape";
import { Jshape } from "./shapes/Jshape";
import { Oshape } from "./shapes/Oshape";
import { BoardSize, Tetromino } from "./shapes/tetromino";
import { pickRandom, Vector2 } from "./utils";

/**
 * TODO: Game over doesn't work
 * TODO: Add other shapes
 *      - JShape
 *      - LShape
 *      - SShape
 *      - TShape
 *      - ZShape
 * TODO: Add a preview of the next tetromino
 * TODO: Add a start screen
 * TODO: Add a pause screen
 * TODO: Add a game over screen
 * TODO: Add a score
 * TODO: Add effects when a row is completed
 */

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

export type Board = Color[][];

export type GameState = {
  board: Board;
  tetromino: Tetromino;
  tetrominoColor: Color;
  tetrominoCells: Vector2[];
  score: number;
  time: number;
  gameOver: boolean;
};

export const EmptyCell = Color.White;

const TetrominosList = [IShape, Jshape, Oshape];
// const TetrominosList = [Jshape];

export const createEmptyBoard = (board: BoardSize): Board =>
  Array(board.height)
    .fill(null)
    .map(() => Array(board.width).fill(Color.White));

export const pickRandomColor = (exclude: Color): Color =>
  pickRandom(
    Object.values(Color)
      .filter((color) => color !== Color.White)
      .filter((color) => color !== exclude)
  );

export const pickRandomTetromino = (): Tetromino => {
  return pickRandom(TetrominosList);
};

export const init = (boardSize: BoardSize): GameState => {
  const board = createEmptyBoard(boardSize);
  const tetromino = pickRandomTetromino();
  const tetrominoColor = pickRandomColor(Color.White);
  const tetrominoCells = tetromino.initialShape(boardSize);

  return {
    board,
    tetromino,
    tetrominoColor,
    tetrominoCells,
    score: 0,
    time: 0,
    gameOver: false,
  };
};

export const update = (
  state: GameState,
  currentTime: number,
  boardSize: BoardSize,
  speed: number,
  move?: Move
): GameState => {
  if (state.gameOver) {
    return { ...state };
  }

  if (move) {
    if (move === Move.Rotate) {
      state.tetrominoCells = state.tetromino.rotate(
        state.tetrominoCells,
        boardSize,
        state.board
      );
    } else {
      state.tetrominoCells = state.tetromino.move(
        state.tetrominoCells,
        move,
        boardSize,
        state.board
      );
    }
  }

  if (state.time === 0) {
    state.time = currentTime;
  }

  if (currentTime - state.time > speed) {
    state.time = currentTime;
    state.tetrominoCells = state.tetromino.move(
      state.tetrominoCells,
      Move.Down,
      boardSize,
      state.board 
    );
  }

  // check if tetromino touches the board
  const isTouching = state.tetrominoCells.some(([x, y]) => {
    if (y === boardSize.height - 1) {
      return true;
    }

    return state.board[y + 1][x] !== Color.White;
  });

  if (isTouching) {
    state.tetrominoCells.forEach(([x, y]) => {
      state.board[y][x] = state.tetrominoColor;
    });

    state.tetromino = pickRandomTetromino();
    state.tetrominoCells = state.tetromino.initialShape(boardSize);
    state.tetrominoColor = pickRandomColor(state.tetrominoColor);
  }

  // check if the game is over
  const isGameOver = state.board[0].some((cell) => cell !== Color.White);
  state.gameOver = isGameOver;

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
      state.board.unshift(Array(boardSize.width).fill(Color.White));
    });

    state.score += fullRows.length;
  }

  return { ...state };
};
