import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TodoAdderDialog } from './todo-adder-dialog.component';

describe('TodoAdderDialog', () => {
  let component: TodoAdderDialog;
  let fixture: ComponentFixture<TodoAdderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoAdderDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: 'mock-title' },
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

  it('should have a title', () => {
    const title = fixture.nativeElement.querySelector('.dialog-title');
    expect(title).toBeTruthy();
    expect(title.innerText).toBe('Add Todo');
  });

  it('should have title input', () => {
    const titleInput = fixture.nativeElement.querySelector('input');
    expect(titleInput).toBeTruthy();
  });

  it('should have button to cancel', () => {
    const cancelButton = fixture.nativeElement.querySelector('.cancel-button');
    expect(cancelButton).toBeTruthy();
  });

  it('should have a button to add', () => {
    const addButton = fixture.nativeElement.querySelector('.add-button');
    expect(addButton).toBeTruthy();
  });

  it('cancel button should close dialog', () => {
    // TODO: test this
  });

  it('add button should close dialog', () => {
    // TODO: test this
  });
});
