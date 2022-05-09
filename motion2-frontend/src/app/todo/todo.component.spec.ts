import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  it('#toggleCompletionStatus should toggle the completion status', () => {
    const comp = new TodoComponent();

    expect(comp.isCompleted).withContext('incomplete at first').toBe(false);

    comp.toggleCompletionStatus();
    expect(comp.isCompleted).withContext('complete after toggle').toBe(true);

    comp.toggleCompletionStatus();
    expect(comp.isCompleted)
      .withContext('incomplete after second toggle')
      .toBe(false);
  });
});
