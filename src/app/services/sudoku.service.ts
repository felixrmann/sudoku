import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, share } from 'rxjs';
import {
  acceptedInputKeyInputs,
  acceptedMoveKeyInputs,
  InputButtonConfig,
  buttons,
  Square,
  SudokuSettings, ActionButtonConfig, actionButtons
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
  public actionButtons: Observable<ActionButtonConfig[]>;
  public inputButtons: Observable<InputButtonConfig[]>;

  private _initialField: Square[][];
  private sudokuSolution: Square[][];
  private activeSquare: Square | null = null;
  private _moveHistory: Square[] = [];

  private isNotesActive: boolean = false;
  private sudokuSettings: SudokuSettings | null = null;
  private _sudokuDifficulty: Difficulty = 'easy';
  private _gameIsDone: boolean = false;


  constructor(private settingsService: SettingsService) {
    const sudoku: Sudoku = getSudoku(this._sudokuDifficulty);
    this._initialField = transformToInternalSudoku(sudoku.puzzle);
    this.sudokuSolution = transformToInternalSudoku(sudoku.solution);
    this.playingField = new BehaviorSubject(transformToInternalSudoku(sudoku.puzzle));

    this.actionButtons = this.playingField.pipe(
      map((): ActionButtonConfig[] => {
        return actionButtons.map((button: ActionButtonConfig): ActionButtonConfig => {
          if (button.action === 'undo') {
            return { ...button, isDisabled: this._moveHistory.length < 1 };
          }
          if (button.action === 'clear') {
            if (!this.activeSquare || this.activeSquare.isFix ||
              (this.activeSquare.value === undefined && this.activeSquare.notedValues.length === 0)) {
              return { ...button, isDisabled: true };
            }
            return { ...button, isDisabled: false };
          }
          if (button.action === 'note') {
            return { ...button, isActive: this.isNotesActive };
          }
          return button;
        });
      }),
      share()
    );

    this.inputButtons = this.playingField.pipe(
      map((field: Square[][]): InputButtonConfig[] => {
        const inputs: Map<number | undefined, number> = new Map();
        field.map((innerArray: Square[]): void => { // accumulates the number of occurrences of each number
          innerArray.map((square: Square): void => {
            inputs.set(square.value, getMapValue(inputs.get(square.value)));
          });
        });
        const buttonResult: InputButtonConfig[] = [];
        buttons.forEach((button: InputButtonConfig): void => {
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
        this.renderField(validateAllFields(this.playingField.value, this.sudokuSolution));
      } else {
        this.renderField(removeValidationMarking(this.playingField.value));
      }
    });
  }

  get sudokuDifficulty(): Difficulty {
    return this._sudokuDifficulty;
  }

  get gameIsDone(): boolean {
    return this._gameIsDone;
  }

  set gameIsDone(newValue: boolean) {
    this._gameIsDone = newValue;
  }

  get initialField(): Square[][] {
    return this._initialField;
  }

  get moveHistory(): Square[] {
    return this._moveHistory
  }

  initNewSudoku(difficulty: Difficulty): void {
    this._sudokuDifficulty = difficulty;
    this._moveHistory = [];
    this.activeSquare = null;

    const sudoku: Sudoku = getSudoku(this._sudokuDifficulty);
    this._initialField = transformToInternalSudoku(sudoku.puzzle);
    this.sudokuSolution = transformToInternalSudoku(sudoku.solution);
    this.renderField(transformToInternalSudoku(sudoku.puzzle));
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
    this.renderField(fieldCopy);
  }

  handleActionButtonClick(button: ActionButtonConfig): void {
    switch (button.action) {
      case 'undo':
        return this.handleUndo();
      case 'clear':
        return this.handleClear();
      case 'note':
        return this.handleNote();
      case 'hint':
        return this.handleHint();
      case 'solve':
        return this.handleSolve();
    }
  }

  handleInputButtonClick(value: number): void {
    if (this.isNotesActive) {
      this.setNewNote(value);
    } else {
      this.setNewField(value);
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (acceptedMoveKeyInputs.includes(event.key)) {
      this.handleMoveKeyPress(event);
    } else if (acceptedInputKeyInputs.includes(event.key)) {
      if (this.isNotesActive) {
        this.setNewNote(event.key === 'Backspace' ? undefined : +event.key);
      } else {
        this.setNewField(event.key === 'Backspace' ? undefined : +event.key);
      }
    }
  }

  private handleUndo(): void {
    if (this._moveHistory.length < 1) return;

    const lastMove: Square | undefined = this._moveHistory.pop();
    if (!lastMove) return;

    let fieldCopy: Square[][] = [...this.playingField.value];
    const lastActiveSquare: Square | null = this.activeSquare;
    if (lastActiveSquare) {
      fieldCopy[lastActiveSquare.y][lastActiveSquare.x] = { ...lastActiveSquare, isSelected: false };
    }

    const squareCopy: Square = fieldCopy[lastMove.y][lastMove.x];
    squareCopy.value = undefined;
    squareCopy.isSelected = false;
    fieldCopy[lastMove.y][lastMove.x] = { ...squareCopy };
    fieldCopy = unmarkAllFields(fieldCopy);
    this.activeSquare = squareCopy;
    this.renderField(fieldCopy);
  }

  private handleClear(): void {
    if (!this.activeSquare) return;

    const fieldCopy: Square[][] = [...this.playingField.value];
    const squareCopy: Square = fieldCopy[this.activeSquare.y][this.activeSquare.x];

    // if field already has no value the notes are cleared
    if (!squareCopy.value) {
      squareCopy.notedValues = [];
    } else {
      squareCopy.value = undefined;
    }
    fieldCopy[this.activeSquare.y][this.activeSquare.x] = { ...squareCopy };
    this.activeSquare = squareCopy;
    this.renderField(fieldCopy);
  }

  private handleNote(): void {
    this.isNotesActive = !this.isNotesActive;
    this.renderField(this.playingField.value);
  }

  private handleHint(): void {
    // TODO
    console.log('toto: implement hint');
  }

  private handleSolve(): void {
    // TODO
    console.log('toto: implement solve');
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
        highlightedNote: undefined,
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
    this.renderField(fieldCopy);
  }

  private setNewNote(value: number | undefined): void {
    const activeSquare: Square | null = this.activeSquare;
    if (!activeSquare || activeSquare.isFix) return;

    // clear the notes when value is undefined
    if (!value) {
      activeSquare.notedValues = [];
    } else {
      //if value already exists in the notes it is removed
      if (activeSquare.notedValues.includes(value)) {
        activeSquare.notedValues = activeSquare.notedValues.filter((element: number): boolean => {
          return element !== value;
        });
      } else {
        activeSquare.notedValues.push(value);
      }
    }

    const fieldCopy: Square[][] = [...this.playingField.value];
    fieldCopy[activeSquare.y][activeSquare.x] = { ...activeSquare };
    this.activeSquare = activeSquare;
    this.renderField(fieldCopy);
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
    this._moveHistory.push(newField);

    this.activeSquare = newField;
    this.renderField(fieldCopy);

    // check if the field is done
    if (isGameDone(fieldCopy)) {
      this.gameIsDone = true;
    }
  }

  private renderField(newField: Square[][]): void {
    this.playingField.next(newField);
  }

}
