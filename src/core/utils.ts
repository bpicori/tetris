export type Vector2 = readonly [number, number];

export const createVector = (x: number, y: number): Vector2 => [x, y];

export const pickRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const hasLeftEdgeCollision = (current: Vector2[]): boolean => {
  return current.some(([x]) => x === 0);
};

export const hasRightEdgeCollision = (
  current: Vector2[],
  width: number
): boolean => {
  return current.some(([x]) => x === width - 1);
};

export const hasBottomEdgeCollision = (
  current: Vector2[],
  height: number
): boolean => {
  return current.some(([_, y]) => y === height - 1);
};
