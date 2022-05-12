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

  it('should toggle completed', () => {
    expect(false).toBeTruthy();
  });

  it('should change title', () => {
    expect(false).toBeTruthy();
  });

  it('should delete todo', () => {
    expect(false).toBeTruthy();
  });

  it('should render title', () => {
    expect(false).toBeTruthy();
  });

  it('should render checkbox', () => {
    expect(false).toBeTruthy();
  });

  it('should render delete button', () => {
    expect(false).toBeTruthy();
  });

  it('should render editable title', () => {
    expect(false).toBeTruthy();
  });
});
