import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { SudokuSettings } from '../../types/sudoku.types';

@Component({
  selector: 'settings',
  styleUrls: ['settings.component.scss'],
  templateUrl: 'settings.component.html'
})
export class SettingsComponent {

  private sudokuSettings: SudokuSettings | null = null;

  constructor(private settingsService: SettingsService) {
    this.settingsService.settings.subscribe((newValue: SudokuSettings): void => {
      this.sudokuSettings = newValue;
    });
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
