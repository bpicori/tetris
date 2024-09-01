import { Board, EmptyCell } from "./tetris";

export type Vector2 = readonly [number, number];

export const createVector = (x: number, y: number): Vector2 => [x, y];

export const pickRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const hasLeftEdgeCollision = (
  current: Vector2[],
  board: Board
): boolean => {
  // check if is out of bounds
  const outOfBounds = current.some(([x]) => x === 0);

  if (outOfBounds) return true;

  // check if is colliding with other pieces
  return current.some(([x, y]) => board[y][x - 1] !== EmptyCell);
};

export const hasRightEdgeCollision = (
  current: Vector2[],
  width: number,
  board: Board
): boolean => {
  // check if is out of bounds
  const outOfBounds = current.some(([x]) => x === width - 1);

  if (outOfBounds) return true;

  // check if is colliding with other pieces
  return current.some(([x, y]) => board[y][x + 1] !== EmptyCell);
};

export const hasBottomEdgeCollision = (
  current: Vector2[],
  height: number,
  board: Board
): boolean => {
  // check if is out of bounds
  const outOfBounds = current.some(([, y]) => y === height - 1);

  if (outOfBounds) return true;

  // check if is colliding with other pieces
  return current.some(([x, y]) => board[y + 1][x] !== EmptyCell);
};
