import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SudokuSettings } from '../types/sudoku.types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private initialSettings: SudokuSettings = {
    theme: 'dark',
    instantFeedback: true,
  }

  public settings: BehaviorSubject<SudokuSettings> = new BehaviorSubject(this.initialSettings);

  public setTheme(theme: 'light' | 'dark'): void {
    this.settings.next({
      ...this.settings.value,
      theme: theme
    });
  }

  public setInstantFeedback(instantFeedback: boolean): void {
    this.settings.next({
      ...this.settings.value,
      instantFeedback: instantFeedback
    });
  }

}
