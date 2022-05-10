// import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';

import { v4 as uuid4 } from 'uuid';
import { of } from 'rxjs';

import { TodoService } from './todo.service';
import Todo from '../models/todo';

describe('TodoService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: TodoService;

  beforeEach(() => {
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(TodoService);

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put']);
    service = new TodoService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTodos should return an array of todos', (done: DoneFn) => {
    const expectedTodos: Todo[] = [];
    for (let i = 0; i < 10; ++i) {
      expectedTodos.push({
        ID: uuid4(),
        Title: `title ${i}`,
        IsCompleted: i % 2 == 0,
        OwnerID: uuid4(),
      });
    }

    httpClientSpy.get.and.returnValue(of(expectedTodos));

    service.getTodos().subscribe({
      next: (todos) => {
        expect(todos).withContext('expected todos').toEqual(expectedTodos);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });

  it('markCompletionStatus should complete todo with true argument', (done: DoneFn) => {
    const mockIncompleteTodo = {
      id: uuid4(),
      title: 'title',
      isCompleted: false,
      ownerID: uuid4(),
    };

    const mockCompleteTodo = {
      ...mockIncompleteTodo,
      isCompleted: true,
    };

    httpClientSpy.put.and.returnValue(of(mockCompleteTodo));
    service.markCompletionStatus(mockIncompleteTodo, true).subscribe({
      next: (todo) => {
        expect(todo)
          .withContext('expected completed todo')
          .toEqual(mockCompleteTodo);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.put.calls.count()).withContext('one call').toBe(1);
  });

  it('markCompletionStatus should make todo pending with false argument', (done: DoneFn) => {
    const mockIncompleteTodo = {
      id: uuid4(),
      title: 'title',
      isCompleted: false,
      ownerID: uuid4(),
    };

    const mockCompleteTodo = {
      ...mockIncompleteTodo,
      isCompleted: true,
    };

    httpClientSpy.put.and.returnValue(of(mockIncompleteTodo));
    service.markCompletionStatus(mockCompleteTodo, false).subscribe({
      next: (todo) => {
        expect(todo)
          .withContext('expected completed todo')
          .toEqual(mockIncompleteTodo);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.put.calls.count()).withContext('one call').toBe(1);
  });
});
