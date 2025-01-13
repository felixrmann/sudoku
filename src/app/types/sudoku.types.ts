import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

export const acceptedMoveKeyInputs: string[] = [
  'ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'
];

export const acceptedInputKeyInputs: string[] = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'
];

export const sudokuDifficulties: SudokuDifficulty[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
  { label: 'Expert', value: 'expert' },
];

export const buttons: ButtonConfig[] = [
  { label: '1', value: 1, isDisabled: false },
  { label: '2', value: 2, isDisabled: false },
  { label: '3', value: 3, isDisabled: false },
  { label: '4', value: 4, isDisabled: false },
  { label: '5', value: 5, isDisabled: false },
  { label: '6', value: 6, isDisabled: false },
  { label: '7', value: 7, isDisabled: false },
  { label: '8', value: 8, isDisabled: false },
  { label: '9', value: 9, isDisabled: false },
  { label: 'Clear', value: undefined, isDisabled: false }
];

export type Square = {
  x: number;
  y: number;
  isFix: boolean;
  value: number | undefined;
  notedValues: number[];
  isSelected: boolean;
  isSameValue: boolean;
  isSameRowOrColumn: boolean;
  isSameBlock: boolean;
  isWrong: boolean;
}

export type ButtonConfig = {
  label: string;
  value: number | undefined;
  isDisabled: boolean;
}

export type SudokuSettings = {
  theme: 'light' | 'dark'; // light / dark mode
  instantFeedback: boolean; // instant input error feedback
}

export type SudokuDifficulty = {
  label: string;
  value: Difficulty;
}
