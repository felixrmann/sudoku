import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSudokuComponent } from './main-sudoku.component';

describe('MainSudokuComponent', () => {
  let component: MainSudokuComponent;
  let fixture: ComponentFixture<MainSudokuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSudokuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSudokuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
