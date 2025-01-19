import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplayService } from '../../services/replay.service';
import { Square } from '../../types/sudoku.types';

@Component({
  selector: 'replay',
  styleUrls: ['replay.component.scss'],
  templateUrl: 'replay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplayComponent implements OnInit, OnDestroy {

  @ViewChild('dialogElement', { static: true }) dialog!: ElementRef<HTMLDialogElement>;

  @Input()
  public set isOpen(newValue: boolean) {
    this._isOpen = newValue;
    this.handleVisibility(newValue);
  }
  private _isOpen: boolean = false;

  @Input()
  public initialField: Square[][] = [];

  @Input()
  public moveHistory: Square[] = [];

  public replayService: ReplayService | null = null;

  ngOnInit(): void {
    this.handleVisibility();
    this.replayService = new ReplayService();
  }

  ngOnDestroy(): void {
    this.handleVisibility(false);
  }

  private handleVisibility(isOpen?: boolean): void {
    if (isOpen ?? this._isOpen) {
      this.dialog.nativeElement.showModal();
      this.replayService?.runPlayback(this.initialField, this.moveHistory);
    } else {
      this.dialog.nativeElement.close();
    }
  }

}
