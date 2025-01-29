import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ReplayService } from '../../services/replay.service';
import { Square, sudokuDifficulties, SudokuDifficulty } from '../../types/sudoku.types';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

@Component({
  selector: 'replay',
  styleUrls: ['replay.component.scss'],
  templateUrl: 'replay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplayComponent implements OnInit, OnDestroy {

  @ViewChild('dialogElement', { static: true }) dialog!: ElementRef<HTMLDialogElement>;

  @Input()
  public set isOpen(newValue: boolean) {
    this._isOpen = newValue;
    this.handleVisibility(newValue);
  }
  private _isOpen: boolean = false;

  @Input()
  public initialField: Square[][] = [];

  @Input()
  public moveHistory: Square[] = [];

  @Output()
  public newGame: EventEmitter<Difficulty> = new EventEmitter();

  public replayService: ReplayService | null = null;
  public readonly difficulties: SudokuDifficulty[] = sudokuDifficulties;
  private selectedDifficulty: Difficulty = 'easy';

  ngOnInit(): void {
    this.handleVisibility();
    this.replayService = new ReplayService();
  }

  ngOnDestroy(): void {
    this.handleVisibility(false);
    this.newGame.emit('easy');
  }

  handleCloseClick(): void {
    this.handleVisibility(false);
    this.newGame.emit('easy');
  }

  handleDifficultySelection(difficulty: string): void {
    this.selectedDifficulty = difficulty as Difficulty;
  }

  handleNewGameClick(): void {
    this.handleVisibility(false);
    this.newGame.emit(this.selectedDifficulty);
  }

  private handleVisibility(isOpen?: boolean): void {
    if (isOpen ?? this._isOpen) {
      this.dialog.nativeElement.showModal();
      this.replayService?.runPlayback(this.initialField, this.moveHistory);
    } else {
      this.dialog.nativeElement.close();
    }
  }
}
