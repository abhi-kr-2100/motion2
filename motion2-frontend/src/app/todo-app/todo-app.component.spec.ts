import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoAppComponent } from './todo-app.component';

describe('TodoAppComponent', () => {
  let component: TodoAppComponent;
  let fixture: ComponentFixture<TodoAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoAppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render todo container', () => {
    const main = fixture.nativeElement as HTMLElement;
    const todoContainer = main.querySelector('app-todo-container');
    expect(todoContainer).toBeTruthy();
  });
});
