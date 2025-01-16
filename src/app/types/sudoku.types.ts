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

export const actionButtons: ActionButtonConfig[] = [
  { label: 'Undo', action: 'undo', isDisabled: false, isActive: false },
  { label: 'Clear', action: 'clear', isDisabled: false, isActive: false },
  { label: 'Note', action: 'note', isDisabled: false, isActive: false },
  { label: 'Hint', action: 'hint', isDisabled: false, isActive: false },
  { label: 'Solve', action: 'solve', isDisabled: false, isActive: false },
]

export const buttons: InputButtonConfig[] = [
  { label: '1', value: 1, isDisabled: false },
  { label: '2', value: 2, isDisabled: false },
  { label: '3', value: 3, isDisabled: false },
  { label: '4', value: 4, isDisabled: false },
  { label: '5', value: 5, isDisabled: false },
  { label: '6', value: 6, isDisabled: false },
  { label: '7', value: 7, isDisabled: false },
  { label: '8', value: 8, isDisabled: false },
  { label: '9', value: 9, isDisabled: false }
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

type ButtonConfig = {
  label: string;
  isDisabled: boolean;
}

export type InputButtonConfig = ButtonConfig & {
  value: number;
}

export type ActionButtonConfig = ButtonConfig & {
  action: 'undo' | 'clear' | 'note' | 'hint' | 'solve';
  isActive: boolean;
}

export type SudokuSettings = {
  theme: 'light' | 'dark'; // light / dark mode
  instantFeedback: boolean; // instant input error feedback
}

export type SudokuDifficulty = {
  label: string;
  value: Difficulty;
}
