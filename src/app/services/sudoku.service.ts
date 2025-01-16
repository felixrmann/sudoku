import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, share } from 'rxjs';
import {
  acceptedInputKeyInputs,
  acceptedMoveKeyInputs,
  ButtonConfig,
  buttons,
  Square,
  SudokuSettings
} from '../types/sudoku.types';
import {
  getMapValue,
  isButtonDisabled,
  isSameSquare,
  markAllFields,
  transformToInternalSudoku, unmarkAllFields,
  updateSquarePos
} from '../utils/sudoku.utils';
import { getSudoku } from 'sudoku-gen';
import { Sudoku } from 'sudoku-gen/dist/types/sudoku.type';
import { SettingsService } from './settings.service';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { isGameDone, removeValidationMarking, validateAllFields, validateSingleField } from '../utils/validation.utils';

@Injectable({ providedIn: 'root' })
export class SudokuService {

  public playingField: BehaviorSubject<Square[][]>;
  public buttons: Observable<ButtonConfig[]>;

  private sudokuSolution: Square[][];
  private activeSquare: Square | null = null;
  private sudokuSettings: SudokuSettings | null = null;


  constructor(private settingsService: SettingsService) {
    const sudoku: Sudoku = getSudoku('easy');
    this.playingField = new BehaviorSubject(transformToInternalSudoku(sudoku.puzzle));
    this.sudokuSolution = transformToInternalSudoku(sudoku.solution);

    this.buttons = this.playingField.pipe(
      map((field: Square[][]): ButtonConfig[] => {
        const inputs: Map<number | undefined, number> = new Map();
        field.map((innerArray: Square[]): void => { // accumulates the number of occurrences of each number
          innerArray.map((square: Square): void => {
            inputs.set(square.value, getMapValue(inputs.get(square.value)));
          });
        });
        const buttonResult: ButtonConfig[] = [];
        buttons.forEach((button: ButtonConfig): void => {
          if (!button.value) { // button with no value is the 'clear' button
            buttonResult[9] = { ...buttons[9], isDisabled: false };
            return;
          }
          buttonResult[button.value - 1] = {
            ...buttons[button.value - 1], isDisabled: isButtonDisabled(button.value, inputs)
          };
        });
        return buttonResult;
      }),
      share()
    );

    this.settingsService.settings.subscribe((newValue: SudokuSettings): void => {
      this.sudokuSettings = newValue;

      if (newValue.instantFeedback) {
        this.playingField.next(validateAllFields(this.playingField.value, this.sudokuSolution));
      } else {
        this.playingField.next(removeValidationMarking(this.playingField.value));
      }
    });
  }

  initNewSudoku(difficulty: Difficulty): Square[][] {
    const sudoku: Sudoku = getSudoku(difficulty);
    this.playingField.next(transformToInternalSudoku(sudoku.puzzle));
    this.sudokuSolution = transformToInternalSudoku(sudoku.solution);
    return transformToInternalSudoku(sudoku.puzzle);
  }

  handleFieldSelect(newActiveSquare: Square): void {
    const lastActiveSquare: Square | null = this.activeSquare;
    let fieldCopy: Square[][] = [...this.playingField.value];
    fieldCopy[newActiveSquare.y][newActiveSquare.x] = newActiveSquare;

    // unselects last active square
    if (lastActiveSquare) {
      if (isSameSquare(lastActiveSquare, newActiveSquare)) {
        fieldCopy[lastActiveSquare.y][lastActiveSquare.x] = {
          ...lastActiveSquare,
          isSelected: !lastActiveSquare.isSelected
        };
      } else {
        fieldCopy[lastActiveSquare.y][lastActiveSquare.x] = { ...lastActiveSquare, isSelected: false };
      }
    }

    /**
     * Marking logic:
     * All fields are unmarked if:
     * - the square has no value therefore is empty
     * - the last active square is the same as the new one AND this field is unselected. This means the user clicked the
     *   same square a second time, and it has to be unselected
     *
     * In any other case all fields with the same value as the new square are selected
     */
    if (!newActiveSquare.value ||
      (lastActiveSquare && isSameSquare(lastActiveSquare, newActiveSquare) && !fieldCopy[lastActiveSquare.y][lastActiveSquare.x].isSelected)) {
      fieldCopy = unmarkAllFields(fieldCopy);
    } else {
      fieldCopy = markAllFields(fieldCopy, newActiveSquare);
    }

    this.activeSquare = newActiveSquare;
    this.playingField.next(fieldCopy);
  }

  handleButtonClick(value: number | undefined): void {
    this.setNewField(value);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (acceptedMoveKeyInputs.includes(event.key)) {
      this.handleMoveKeyPress(event);
    } else if (acceptedInputKeyInputs.includes(event.key)) {
      this.setNewField(event.key === 'Backspace' ? undefined : +event.key);
    }
  }

  private handleMoveKeyPress(event: KeyboardEvent): void {
    const activeSquare: Square | null = this.activeSquare;
    let fieldCopy: Square[][] = [...this.playingField.value];
    let movedActiveSquare: Square;

    if (activeSquare) {
      movedActiveSquare = updateSquarePos(event.key.substring(5), activeSquare);
    } else {
      movedActiveSquare = {
        value: undefined,
        x: 0,
        y: 0,
        isFix: false,
        notedValues: [],
        isSelected: false,
        isSameValue: false,
        isSameRowOrColumn: false,
        isSameBlock: false,
        isWrong: false,
      };
    }

    // unselects old field
    if (activeSquare) {
      fieldCopy[activeSquare.y][activeSquare.x] = {
        ...fieldCopy[activeSquare.y][activeSquare.x], isSelected: false
      };
    }
    // select new field
    fieldCopy[movedActiveSquare.y][movedActiveSquare.x] = {
      ...fieldCopy[movedActiveSquare.y][movedActiveSquare.x], isSelected: true
    };
    this.activeSquare = fieldCopy[movedActiveSquare.y][movedActiveSquare.x];
    fieldCopy = markAllFields(fieldCopy, fieldCopy[movedActiveSquare.y][movedActiveSquare.x]);
    this.playingField.next(fieldCopy);
  }

  private setNewField(value: number | undefined): void {
    const activeSquare: Square | null = this.activeSquare;
    if (!activeSquare || activeSquare.isFix) return;

    let fieldCopy: Square[][] = [...this.playingField.value];
    const newField: Square = { ...activeSquare, value: value };

    if (!value) {
      // unselect field if it is cleared
      newField.isSelected = false;
    }
    // mark all fields of the same value
    fieldCopy = markAllFields(fieldCopy, newField);

    // validation if active in settings
    if (this.sudokuSettings?.instantFeedback) {
      newField.isWrong = validateSingleField(newField, this.sudokuSolution);
    }

    fieldCopy[activeSquare.y][activeSquare.x] = newField;

    // check if the field is done
    if (isGameDone(fieldCopy)) {
      console.log('game done');
      this.initNewSudoku('easy');
      return;
    }

    this.activeSquare = newField;
    this.playingField.next(fieldCopy);
  }

}
