import { Square } from '../types/sudoku.types';

export function getMapValue(current: number | undefined): number {
  if (!current) return 1;
  return current + 1;
}

export function isButtonDisabled(buttonValue: number | undefined, inputs: Map<number | undefined, number>): boolean {
  const buttonAmount: number | undefined = inputs.get(buttonValue);
  if (!buttonAmount) return false;
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
      const foundValue: string | undefined = sudoku.at(( y * 9 ) + x);
      const value: number | undefined = foundValue && foundValue !== '-' ? +foundValue : undefined;
      row[x] = {
        x: x,
        y: y,
        isFix: value !== undefined,
        value: value,
        notedValues: [],
        highlightedNote: undefined,
        isSelected: false,
        isSameValue: false,
        isSameBlock: false,
        isSameRowOrColumn: false,
        isWrong: false
      };
    }
    result[y] = row;
  }
  return result;
}

export function unmarkAllFields(fields: Square[][]): Square[][] {
  const unmarkedFields: Square[][] = [...fields];
  for (let y: number = 0; y < 9; y++) {
    for (let x: number = 0; x < 9; x++) {
      unmarkedFields[y][x] = {
        ...unmarkedFields[y][x],
        highlightedNote: undefined,
        isSameValue: false,
        isSameRowOrColumn: false,
        isSameBlock: false
      };
    }
  }
  return unmarkedFields;
}

export function markAllFields(fields: Square[][], source: Square): Square[][] {
  const markedFields: Square[][] = [...fields];

  for (let y: number = 0; y < 9; y++) {
    for (let x: number = 0; x < 9; x++) {
      const target: Square = {
        ...markedFields[y][x],
        isSameValue: false,
        isSameRowOrColumn: false,
        isSameBlock: false
      };

      if (source.value) {
        // marks all fields with the same value
        if (target.value === source.value) {
          target.isSameValue = true;
        }

        // marks all fields in the same row and column
        if (( target.x === source.x || target.y === source.y )) {
          target.isSameRowOrColumn = true;
        }

        // marks all fields in the same box
        if (Math.floor(target.y / 3) === Math.floor(source.y / 3) &&
          Math.floor(target.x / 3) === Math.floor(source.x / 3)) {
          target.isSameBlock = true;
        }

        // highlights the notes of a square
        target.highlightedNote = source.value;
      }

      markedFields[y][x] = target;
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
