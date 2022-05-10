import { ComponentFixture, TestBed } from '@angular/core/testing';

import { v4 as uuid4 } from 'uuid';

import { TodoAdderComponent } from './todo-adder.component';
import { TodoService } from '../todo.service';
import Todo from '../../models/todo';
import { of } from 'rxjs';

describe('TodoAdderComponent', () => {
  let component: TodoAdderComponent;
  let fixture: ComponentFixture<TodoAdderComponent>;

  let todoServiceSpy = jasmine.createSpyObj('TodoService', ['addTodo']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoAdderComponent],
      providers: [{ provide: TodoService, useValue: todoServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add todo', (done: DoneFn) => {
    const title = 'title';
    const mockTodo: Todo = {
      ID: uuid4(),
      Title: title,
      IsCompleted: false,
      OwnerID: uuid4(),
    };
    todoServiceSpy.addTodo.and.returnValue(of(mockTodo));

    component.addTodo(title).subscribe({
      next: (todo) => {
        expect(todo).toEqual(mockTodo);
        done();
      },
      error: done.fail,
    });

    expect(todoServiceSpy.addTodo).toHaveBeenCalledWith(title);
    expect(todoServiceSpy.addTodo.calls.count()).toBe(1);
  });
});
