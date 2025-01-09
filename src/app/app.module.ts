import { NgModule } from '@angular/core';
import { SudokuService } from './services/sudoku.service';
import { SudokuModule } from './components/sudoku.module';
import { MainComponent } from './components/main/main.component';

@NgModule({
  providers: [SudokuService],
  imports: [SudokuModule],
  bootstrap: [MainComponent]
})
export class AppModule {
}
