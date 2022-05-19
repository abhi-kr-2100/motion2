import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogData, TodoAdderDialog } from './todo-adder.dialog';

describe('TodoAdder Dialog', () => {
  let component: TodoAdderDialog;
  let fixture: ComponentFixture<TodoAdderDialog>;
  let data: DialogData;

  beforeEach(async () => {
    data = { title: 'test' };

    await TestBed.configureTestingModule({
      declarations: [TodoAdderDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoAdderDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a title', () => {
    const title = fixture.nativeElement.querySelector('.dialog-title');
    expect(title.textContent).toEqual('Add a todo');
  });

  it('should render a title input', () => {
    const title = fixture.nativeElement.querySelector('input[name="title"]');
    expect(title).toBeTruthy();
  });

  it('should render an add button', () => {
    const addButton = fixture.nativeElement.querySelector('.todo-add-btn');
    expect(addButton).toBeTruthy();
    expect(addButton.textContent).toBe('Add');
  });

  it('should render a cancel button', () => {
    const cancelButton =
      fixture.nativeElement.querySelector('.todo-cancel-btn');
    expect(cancelButton).toBeTruthy();
    expect(cancelButton.textContent).toBe('Cancel');
  });
});
