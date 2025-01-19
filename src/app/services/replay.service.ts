import { Square } from '../types/sudoku.types';
import { BehaviorSubject } from 'rxjs';

export class ReplayService {

  public replayedGame: BehaviorSubject<Square[][]> | null = null;

  public runPlayback(initialField: Square[][], moveHistory: Square[]): void {
    this.replayedGame = new BehaviorSubject(initialField);

    let index: number = 0;
    const interval = setInterval((): void => {
      if (!this.replayedGame) return;

      const fieldCopy: Square[][] = [...this.replayedGame.value];
      const currentMove: Square = moveHistory[index];

      fieldCopy[currentMove.y][currentMove.x] = {
        ...currentMove,
        isSelected: false,
        isSameBlock: false,
        isSameValue: false,
        isSameRowOrColumn: false,
      };
      this.replayedGame.next([...fieldCopy]);

      if (index + 1 === moveHistory.length) {
        clearInterval(interval);
      }
      index++;
    }, 500);
  }

}
