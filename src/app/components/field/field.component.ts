import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Square } from '../../types/sudoku.types';

@Component({
  selector: 'field',
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent {

  @Input()
  public field: Square[][] | null = null;

  @Output()
  public select: EventEmitter<Square> = new EventEmitter();

  handleSelect(square: Square): void {
    this.select.emit(square);
  }

}
