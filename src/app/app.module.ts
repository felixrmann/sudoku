import { NgModule } from '@angular/core';
import { SudokuService } from './services/sudoku.service';
import { SudokuModule } from './components/sudoku.module';
import { MainSudokuComponent } from './components/main-sudoku/main-sudoku.component';

@NgModule({
  providers: [SudokuService],
  imports: [SudokuModule],
  bootstrap: [MainSudokuComponent]
})
export class AppModule {
}
