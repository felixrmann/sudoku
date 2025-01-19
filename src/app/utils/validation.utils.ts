import { Square } from '../types/sudoku.types';

export function isGameDone(field: Square[][]): boolean {
  for (let y: number = 0; y < 9; y++) {
    for (let x: number = 0; x < 9; x ++) {
      if (!field[y][x].value || field[y][x].isWrong) return false;
    }
  }
  return true;
}

export function validateSingleField(field: Square, sudokuSolution: Square[][]): boolean {
  return !!field.value && sudokuSolution[field.y][field.x].value !== field.value;
}

export function validateAllFields(allFields: Square[][], sudokuSolution: Square[][]): Square[][] {
  const result: Square[][] = [];
  for (let y: number = 0; y < 9; y++) {
    const row: Square[] = [];
    for (let x: number = 0; x < 9; x++) {
      const field: Square = allFields[y][x];
      row[x] = { ...field, isWrong: (!!field.value && sudokuSolution[y][x].value !== field.value) }
    }
    result[y] = row;
  }
  return result;
}

export function removeValidationMarking(allFields: Square[][]): Square[][] {
  return allFields.map((row: Square[]): Square[] => {
    return row.map((field: Square): Square => {
      return { ...field, isWrong: false };
    });
  });
}
