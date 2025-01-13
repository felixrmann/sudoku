import { Component, HostListener, inject } from '@angular/core';
import { SudokuService } from '../../services/sudoku.service';
import { acceptedInputKeyInputs, acceptedMoveKeyInputs, SudokuSettings } from '../../types/sudoku.types';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'main-sudoku',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  public sudokuService: SudokuService = inject(SudokuService);

  private _settings: SudokuSettings | null = null;
  private _showSettings: boolean = false;

  constructor(private settingsService: SettingsService ) {
    this.settingsService.settings.subscribe((value: SudokuSettings): void => {
      this._settings = value;
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.isTrusted &&
      acceptedMoveKeyInputs.includes(event.key) || acceptedInputKeyInputs.includes(event.key)) {
      this.sudokuService.handleKeyPress(event);
    }
  }

  get settingsTheme(): string {
    if (!this._settings) return 'dark';

    return this._settings.theme === 'dark' ? 'dark' : 'light';
  }

  get showSettings(): boolean {
    return this._showSettings;
  }

  toggleSettings(): void {
    this._showSettings = !this._showSettings;
  }

}
