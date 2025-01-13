import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Square } from '../../types/sudoku.types';

@Component({
  selector: 'square',
  templateUrl: 'square.component.html',
  styleUrl: 'square.component.scss'
})
export class SquareComponent {

  @Input()
  public y: number | null = null;

  @Input()
  public x: number | null = null;

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

    return classes.join(' ');
  }

  get hasXBorder(): boolean {
    if (!this.x) return false;
    return (this.x + 1) % 3 === 0 && (this.x + 1 !== 9);
  }

  get hasYBorder(): boolean {
    if (!this.y) return false;
    return (this.y + 1) % 3 === 0 && (this.y + 1 !== 9);
  }

  handleClick(square: Square | null): void {
    if (!square) return;
    this.select.emit({ ...square, isSelected: !square.isSelected });
  }

}
