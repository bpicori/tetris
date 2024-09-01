import { IShape } from "./shapes/Ishape";
import { Jshape } from "./shapes/Jshape";
import { Lshape } from "./shapes/Lshape";
import { Oshape } from "./shapes/Oshape";
import { BoardSize, Tetromino } from "./shapes/tetromino";
import { pickRandom, Vector2 } from "./utils";

/**
 * TODO: when rotating J or L near the edge, the piece is not rotated and blocks the movement
 * TODO: Add other shapes
 *      - SShape
 *      - TShape
 *      - ZShape
 * TODO: Add a preview of the next tetromino
 * TODO: Add a start screen
 * TODO: Add a pause screen
 * TODO: Add a score
 * TODO: Add effects when a row is completed
 */

export enum Move {
  Left = "left",
  Right = "right",
  Down = "down",
  Rotate = "rotate",
}

export type Board = string[][];

export type GameState = {
  board: Board;
  boardSize: BoardSize;
  tetromino: Tetromino;
  tetrominoColor: string;
  tetrominoCells: Vector2[];
  score: number;
  time: number;
  gameOver: boolean;
  colors: string[]; // should not contain the empty cell value
  emptyCell: string;
};

const getTetrominoList = () => [IShape, Jshape, Oshape, Lshape];

export const createEmptyBoard = (
  boardSize: BoardSize,
  emptyCell: string
): Board =>
  Array(boardSize.height)
    .fill(null)
    .map(() => Array(boardSize.width).fill(emptyCell));

export const pickRandomColor = (
  colors: string[],
  excludeColor?: string
): string => {
  if (!excludeColor) {
    return pickRandom(colors);
  }

  return pickRandom(colors.filter((color) => color !== excludeColor));
};

export const pickRandomTetromino = (): Tetromino => {
  return pickRandom(getTetrominoList());
};

export const init = (
  boardSize: BoardSize,
  colors: string[],
  emptyCell: string
): GameState => {
  const board = createEmptyBoard(boardSize, emptyCell);
  const tetromino = pickRandomTetromino();
  const tetrominoColor = pickRandomColor(colors);
  const tetrominoCells = tetromino.initialShape(boardSize);

  return {
    board,
    tetromino,
    tetrominoColor,
    tetrominoCells,
    score: 0,
    time: 0,
    gameOver: false,
    boardSize,
    colors,
    emptyCell,
  };
};

export const update = (
  state: GameState,
  currentTime: number,
  speed: number,
  move?: Move
): GameState => {
  const { boardSize, emptyCell, colors } = state;

  if (state.gameOver) {
    return { ...state };
  }

  if (move) {
    if (move === Move.Rotate) {
      state.tetrominoCells = state.tetromino.rotate(
        state.tetrominoCells,
        boardSize,
        state.board,
        emptyCell
      );
    } else {
      state.tetrominoCells = state.tetromino.move(
        state.tetrominoCells,
        move,
        boardSize,
        state.board,
        emptyCell
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
      state.board,
      emptyCell
    );
  }

  // check if tetromino touches the board
  const isTouching = state.tetrominoCells.some(([x, y]) => {
    if (y === boardSize.height - 1) {
      return true;
    }

    return state.board[y + 1][x] !== emptyCell;
  });

  if (isTouching) {
    state.tetrominoCells.forEach(([x, y]) => {
      state.board[y][x] = state.tetrominoColor;
    });

    state.tetromino = pickRandomTetromino();
    state.tetrominoCells = state.tetromino.initialShape(boardSize);
    state.tetrominoColor = pickRandomColor(colors, state.tetrominoColor);
  }

  // check if the game is over
  const isGameOver = state.board[0].some((cell) => cell !== emptyCell);
  state.gameOver = isGameOver;

  // detect if there is a full row
  const fullRows = state.board.reduce((acc, row, y) => {
    if (row.every((cell) => cell !== emptyCell)) {
      acc.push(y);
    }

    return acc;
  }, [] as number[]);

  if (fullRows.length > 0) {
    fullRows.forEach((y) => {
      state.board.splice(y, 1);
      state.board.unshift(Array(boardSize.width).fill(emptyCell));
    });

    state.score += fullRows.length;
  }

  return { ...state };
};
