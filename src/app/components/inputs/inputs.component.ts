import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonConfig } from '../../types/sudoku.types';

@Component({
  selector: 'inputs',
  templateUrl: 'inputs.component.html',
  styleUrl: 'inputs.component.scss'
})
export class InputsComponent {

  @Input()
  public buttonConfig: ButtonConfig[] | null = null;

  @Output()
  private buttonClick: EventEmitter<number | undefined> = new EventEmitter();

  handleButtonClick(value: number | undefined): void {
    this.buttonClick.emit(value);
  }

}
