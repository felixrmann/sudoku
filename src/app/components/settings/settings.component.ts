import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { sudokuDifficulties, SudokuDifficulty, SudokuSettings } from '../../types/sudoku.types';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

@Component({
  selector: 'settings',
  styleUrls: ['settings.component.scss'],
  templateUrl: 'settings.component.html'
})
export class SettingsComponent {

  @Input()
  public isVisible: boolean = false;

  @Output()
  public newGame: EventEmitter<Difficulty> = new EventEmitter();

  public difficulties: SudokuDifficulty[] = sudokuDifficulties;
  private sudokuSettings: SudokuSettings | null = null;

  constructor(private settingsService: SettingsService) {
    this.settingsService.settings.subscribe((newValue: SudokuSettings): void => {
      this.sudokuSettings = newValue;
    });
  }

  handleDifficultySelection(difficulty: string): void {
    this.newGame.emit(difficulty as Difficulty);
  }

  handleThemeClick(): void {
    if (!this.sudokuSettings) return;
    this.settingsService.setTheme(this.sudokuSettings.theme === 'light' ? 'dark' : 'light');
  }

  handleFeedbackClick(): void {
    if (!this.sudokuSettings) return;
    this.settingsService.setInstantFeedback(!this.sudokuSettings.instantFeedback);
  }

  get themeButtonText(): string {
    if (!this.sudokuSettings) return '';
    return this.sudokuSettings.theme === 'light' ? 'Dark' : 'Light';
  }

  get instantFeedbackButtonText(): string {
    if (!this.sudokuSettings) return '';
    return this.sudokuSettings.instantFeedback ?
      'No instant feedback' : 'Instant feedback';
  }
}
