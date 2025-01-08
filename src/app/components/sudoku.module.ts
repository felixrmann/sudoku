import { NgModule } from '@angular/core';
import { FieldComponent } from './field/field.component';
import { SquareComponent } from './square/square.component';
import { MainSudokuComponent } from './main-sudoku/main-sudoku.component';
import { BrowserModule } from '@angular/platform-browser';
import { InputsComponent } from './inputs/inputs.component';
import { FieldPipe } from '../services/field.pipe';
import { SettingsComponent } from './settings/settings.component';

const components = [
  FieldComponent,
  FieldPipe,
  SquareComponent,
  MainSudokuComponent,
  InputsComponent,
  SettingsComponent
];

@NgModule({
  imports: [BrowserModule],
  declarations: [components]
})
export class SudokuModule {
}
