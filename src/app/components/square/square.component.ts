import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Square } from '../../types/sudoku.types';

@Component({
  selector: 'square',
  templateUrl: 'square.component.html',
  styleUrl: 'square.component.scss'
})
export class SquareComponent {

  @Input()
  public square: Square | null = null;

  @Output()
  private select: EventEmitter<Square> = new EventEmitter();

  get squareClasses(): string {
    if (!this.square) return '';
    const classes: string[] = [];

    if (this.square.isSelected) classes.push('selected');
    if (this.square.isSameValue && !this.square.isSelected) classes.push('mark-same-value');
    if (this.square.isSameRowOrColumn && !this.square.isSelected) classes.push('mark-same-row-or-column');
    if (this.square.isSameBlock && !this.square.isSelected) classes.push('mark-same-block');
    if (!this.square.isFix) classes.push('user-added-value');
    if (this.square.isWrong && !this.square.isSelected) classes.push('wrong');

    if ((this.square.x + 1) % 3 === 0 && (this.square.x + 1 !== 9)) classes.push('inner-x-border');
    if ((this.square.y + 1) % 3 === 0 && (this.square.y + 1 !== 9)) classes.push('inner-y-border');

    return classes.join(' ');
  }

  get showSquareValue(): boolean {
    return this.square === null || this.square.value !== undefined;
  }

  get notes(): string[] {
    if (!this.square) return [];
    return this.convertNotes(this.square.notedValues);
  }

  handleClick(square: Square | null): void {
    if (!square) return;
    this.select.emit({ ...square, isSelected: !square.isSelected });
  }

  private convertNotes(rawNotes: number[]): string[] {
    const result: string[] = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    for (const note of rawNotes) {
      result[note - 1] = `${note}`;
    }
    return result;
  }

}
