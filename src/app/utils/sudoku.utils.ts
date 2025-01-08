import { Square } from '../types/sudoku.types';

export function getMapValue(current: number | undefined): number {
  if (!current) return 1;
  return current + 1;
}

export function isButtonDisabled(buttonValue: number | undefined, inputs: Map<number | undefined, number>): boolean {
  const buttonAmount: number | undefined = inputs.get(buttonValue);
  if (!buttonAmount) return true;
  return buttonAmount === 9;
}

export function isSameSquare(squareA: Square, squareB: Square): boolean {
  return squareA.y === squareB.y && squareA.x === squareB.x;
}

export function transformToInternalSudoku(sudoku: string): Square[][] {
  const result: Square[][] = [];
  for (let y: number = 0; y < 9; y++) {
    const row: Square[] = [];
    for (let x: number = 0; x < 9; x++) {
      const foundValue: string | undefined = sudoku.at((y * 9) + x);
      const value: number | undefined = foundValue && foundValue !== '-' ? +foundValue : undefined;
      row[x] = { x: x, y: y, isFix: value !== undefined, value: value, notedValues: [], isSelected: false, isMarked: false, isWrong: false };
    }
    result[y] = row;
  }
  return result;
}

export function markAllFields(fields: Square[][], value: number | undefined): Square[][] {
  const markedFields: Square[][] = [ ...fields ];
  for (let y: number = 0; y < markedFields.length; y++) {
    for (let x: number = 0; x < markedFields[y].length; x++) {
      if (!value) {
        markedFields[y][x] = { ...markedFields[y][x], isMarked: false };
        continue;
      }
      if (markedFields[y][x].value === value) {
        markedFields[y][x] = { ...markedFields[y][x], isMarked: true };
      } else {
        markedFields[y][x] = { ...markedFields[y][x], isMarked: false };
      }
    }
  }
  return markedFields;
}

export function updateSquarePos(direction: string, activeSquare: Square): Square {
  const modifiedActiveSquare: Square = { ...activeSquare };

  switch (direction) {
    case 'Up': {
      if (modifiedActiveSquare.y - 1 > -1) {
        modifiedActiveSquare.y--;
      }
      break;
    }
    case 'Right': {
      if (modifiedActiveSquare.x + 1 < 9) {
        modifiedActiveSquare.x++;
      }
      break;
    }
    case 'Down': {
      if (modifiedActiveSquare.y + 1 < 9) {
        modifiedActiveSquare.y++;
      }
      break;
    }
    case 'Left': {
      if (modifiedActiveSquare.x - 1 > -1) {
        modifiedActiveSquare.x--;
      }
      break;
    }
  }
  return modifiedActiveSquare;
}
