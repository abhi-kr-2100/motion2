import { ComponentFixture, TestBed } from '@angular/core/testing';

import { v4 as uuid4 } from 'uuid';
import { of } from 'rxjs';

import { TodoContainerComponent } from './todo-container.component';
import { TodoService } from '../todo.service';
import Todo from '../../models/todo';

describe('TodoContainerComponent', () => {
  let component: TodoContainerComponent;
  let fixture: ComponentFixture<TodoContainerComponent>;
  let element: HTMLElement;
  let mockTodos: Todo[] = [];

  const todoService = jasmine.createSpyObj('TodoService', [
    'getTodos',
    'markCompletionStatus',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoContainerComponent],
      providers: [{ provide: TodoService, useValue: todoService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoContainerComponent);
    component = fixture.componentInstance;

    for (let i = 0; i < 10; ++i) {
      mockTodos.push({
        ID: uuid4(),
        Title: `title ${i}`,
        IsCompleted: i % 2 == 0,
        OwnerID: uuid4(),
      });
    }

    todoService.getTodos.and.returnValue(of(mockTodos));

    fixture.detectChanges();

    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve todos on init', () => {
    expect(component.todos).toEqual(mockTodos);
  });

  it('should render todos', () => {
    const todoItems = element.getElementsByTagName('app-todo');

    expect(todoItems.length).toBe(mockTodos.length);
    for (let i = 0; i < mockTodos.length; ++i) {
      const idAttr = todoItems[i].getAttribute('id');
      expect(idAttr).withContext(`id is ${idAttr}`).toBe(mockTodos[i].ID);

      const titleAttr = todoItems[i].getAttribute('title');
      expect(titleAttr)
        .withContext(`title is ${titleAttr}`)
        .toBe(mockTodos[i].Title);

      // since isCompleted is a boolean, we can't use getAttribute to retrive
      // it
      // const isCompletedAttr = todoItems[i].getAttribute('isCompleted');
      // expect(isCompletedAttr)
      //   .withContext(`completion status is ${isCompletedAttr}`)
      //   .not.toBeNull();
    }
  });
});
