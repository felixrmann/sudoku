import { Pipe, PipeTransform } from '@angular/core';
import { Square } from '../types/sudoku.types';

@Pipe({
  name: 'readableField'
})
export class FieldPipe implements PipeTransform {
  transform(square: Square | null): string {
    if (!square || !square.value) return '';
    return square.value.toString();
  }
}
