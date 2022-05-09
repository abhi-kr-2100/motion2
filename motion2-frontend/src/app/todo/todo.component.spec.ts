import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#toggleCompletionStatus should toggle the isCompleted property', () => {
    expect(component.isCompleted)
      .withContext('incomplete at first')
      .toBeFalsy();

    component.toggleCompletionStatus();
    expect(component.isCompleted)
      .withContext('complete after toggle')
      .toBeTruthy();

    component.toggleCompletionStatus();
    expect(component.isCompleted)
      .withContext('incomplete after second toggle')
      .toBeFalsy();
  });
});
