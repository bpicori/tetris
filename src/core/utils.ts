import { Board } from "./tetris";

export type Vector2 = readonly [number, number];

export const pickRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const safeAccess = <T>(
  arr: T[][],
  x: number,
  y: number
): T | undefined => {
  if (y < 0 || y >= arr.length) return undefined;
  if (x < 0 || x >= arr[y].length) return undefined;

  return arr[y][x];
};

export const hasLeftEdgeCollision = (
  current: Vector2[],
  board: Board,
  emptyCell: string
): boolean => {
  // check if is out of bounds
  const outOfBounds = current.some(([x]) => x === 0);

  if (outOfBounds) return true;

  // check if is colliding with other pieces
  return current.some(([x, y]) => board[y][x - 1] !== emptyCell);
};

export const hasRightEdgeCollision = (
  current: Vector2[],
  width: number,
  board: Board,
  emptyCell: string
): boolean => {
  // check if is out of bounds
  const outOfBounds = current.some(([x]) => x === width - 1);

  if (outOfBounds) return true;

  // check if is colliding with other pieces
  return current.some(([x, y]) => board[y][x + 1] !== emptyCell);
};

export const hasBottomEdgeCollision = (
  current: Vector2[],
  height: number,
  board: Board,
  emptyCell: string
): boolean => {
  // check if is out of bounds
  const outOfBounds = current.some(([, y]) => y === height - 1);

  if (outOfBounds) return true;

  // check if is colliding with other pieces
  return current.some(([x, y]) => board[y + 1][x] !== emptyCell);
};
