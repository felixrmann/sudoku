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

  get hasXBorder(): boolean {
    if (!this.x) return false;
    return (this.x + 1) % 3 === 0 && (this.x + 1 !== 9);
  }

  get hasYBorder(): boolean {
    if (!this.y) return false;
    return (this.y + 1) % 3 === 0 && (this.y + 1 !== 9);
  }

  get isSelected(): boolean {
    if (!this.square) return false;
    return this.square.isSelected;
  }

  get isMarked(): boolean {
    if (!this.square) return false;
    return this.square.isMarked;
  }

  get isFix(): boolean {
    if (!this.square) return false;
    return this.square.isFix;
  }

  get isWrong(): boolean {
    if (!this.square) return false;
    return this.square.isWrong;
  }

  handleClick(square: Square | null): void {
    if (!square) return;
    this.select.emit({ ...square, isSelected: !square.isSelected});
  }

}
