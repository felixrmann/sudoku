import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionButtonConfig, InputButtonConfig } from '../../types/sudoku.types';

@Component({
  selector: 'inputs',
  templateUrl: 'inputs.component.html',
  styleUrl: 'inputs.component.scss'
})
export class InputsComponent {

  @Input()
  public actionButtonConfig: ActionButtonConfig[] | null = null;

  @Input()
  public inputButtonConfig: InputButtonConfig[] | null = null;

  @Output()
  private actionButtonClick: EventEmitter<ActionButtonConfig> = new EventEmitter();

  @Output()
  private inputButtonClick: EventEmitter<number> = new EventEmitter();

  handleActionButtonClick(button: ActionButtonConfig): void {
    this.actionButtonClick.emit(button);
  }

  handleInputButtonClick(value: number): void {
    this.inputButtonClick.emit(value);
  }

}
