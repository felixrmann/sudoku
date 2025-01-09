import { Component, HostListener, inject } from '@angular/core';
import { SudokuService } from '../../services/sudoku.service';
import { acceptedInputKeyInputs, acceptedMoveKeyInputs } from '../../types/sudoku.types';

@Component({
  selector: 'main-sudoku',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  public sudokuService: SudokuService = inject(SudokuService);

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.isTrusted &&
      acceptedMoveKeyInputs.includes(event.key) || acceptedInputKeyInputs.includes(event.key)) {
      this.sudokuService.handleKeyPress(event);
    }
  }

}
