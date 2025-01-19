import { NgModule } from '@angular/core';
import { FieldComponent } from './field/field.component';
import { SquareComponent } from './square/square.component';
import { MainComponent } from './main/main.component';
import { BrowserModule } from '@angular/platform-browser';
import { InputsComponent } from './inputs/inputs.component';
import { FieldPipe } from '../services/field.pipe';
import { SettingsComponent } from './settings/settings.component';
import { ReplayComponent } from './replay/replay.component';

const components = [
  FieldComponent,
  FieldPipe,
  SquareComponent,
  MainComponent,
  InputsComponent,
  SettingsComponent,
  ReplayComponent
];

@NgModule({
  imports: [BrowserModule],
  declarations: [components]
})
export class SudokuModule {
}
