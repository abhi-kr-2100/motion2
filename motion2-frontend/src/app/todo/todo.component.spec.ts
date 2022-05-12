import { ComponentFixture, TestBed } from '@angular/core/testing';

import { v4 as uuid4 } from 'uuid';

import { Todo } from 'src/models/todo';
import { ApiRequestService } from '../api-request.service';

import { TodoComponent } from './todo.component';
import { of } from 'rxjs';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let apiRequestSpy: jasmine.SpyObj<ApiRequestService>;

  beforeEach(async () => {
    apiRequestSpy = jasmine.createSpyObj<ApiRequestService>(
      'ApiRequestService',
      ['get', 'post', 'put', 'delete']
    );
    await TestBed.configureTestingModule({
      declarations: [TodoComponent],
      providers: [{ provide: ApiRequestService, useValue: apiRequestSpy }],
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

  it('should toggle incomplete todo to complete', () => {
    const updatedTodo: Todo = {
      ID: uuid4(),
      Title: 'mock-title',
      IsCompleted: true,
      OwnerID: uuid4(),
    };

    const form = {
      ID: updatedTodo.ID,
      Title: updatedTodo.Title,
      IsCompleted: updatedTodo.IsCompleted,
    };

    apiRequestSpy.put.and.returnValue(of(updatedTodo));

    const component = TestBed.createComponent(TodoComponent).componentInstance;
    component.id = updatedTodo.ID;
    component.title = updatedTodo.Title;
    component.isCompleted = !updatedTodo.IsCompleted;
    component.ownerID = updatedTodo.OwnerID;

    component.toggleCompleted().subscribe({
      next: (todo) => {
        expect(todo).toEqual(updatedTodo);
      },
      error: (err) => {
        expect(false).withContext("error shouldn't have occured").toBeTrue();
      },
    });

    expect(apiRequestSpy.put).toHaveBeenCalledTimes(1);
    expect(apiRequestSpy.put.calls.mostRecent().args[0]).toBe(
      `/todos/${updatedTodo.ID}`
    );
    expect(apiRequestSpy.put.calls.mostRecent().args[1]).toEqual(form);
  });

  it('should toggle completed todo to incomplete', () => {
    const updatedTodo: Todo = {
      ID: uuid4(),
      Title: 'mock',
      IsCompleted: false,
      OwnerID: uuid4(),
    };

    const form = {
      ID: updatedTodo.ID,
      Title: updatedTodo.Title,
      IsCompleted: updatedTodo.IsCompleted,
    };

    apiRequestSpy.put.and.returnValue(of(updatedTodo));

    const component = TestBed.createComponent(TodoComponent).componentInstance;
    component.id = updatedTodo.ID;
    component.title = updatedTodo.Title;
    component.isCompleted = !updatedTodo.IsCompleted;
    component.ownerID = updatedTodo.OwnerID;

    component.toggleCompleted().subscribe({
      next: (todo) => {
        expect(todo).toEqual(updatedTodo);
      },
      error: (err) => {
        expect(false).withContext("error shouldn't have occured").toBeTrue();
      },
    });

    expect(apiRequestSpy.put).toHaveBeenCalledTimes(1);
    expect(apiRequestSpy.put.calls.mostRecent().args[0]).toBe(
      `/todos/${updatedTodo.ID}`
    );
    expect(apiRequestSpy.put.calls.mostRecent().args[1]).toEqual(form);
  });

  it('should change title', () => {
    const updatedTodo: Todo = {
      ID: uuid4(),
      Title: 'updated',
      IsCompleted: false,
      OwnerID: uuid4(),
    };

    const form = {
      ID: updatedTodo.ID,
      Title: updatedTodo.Title,
      IsCompleted: updatedTodo.IsCompleted,
    };

    apiRequestSpy.put.and.returnValue(of(updatedTodo));

    const component = TestBed.createComponent(TodoComponent).componentInstance;
    component.id = updatedTodo.ID;
    component.title = 'mock-title';
    component.isCompleted = updatedTodo.IsCompleted;
    component.ownerID = updatedTodo.OwnerID;

    component.updateTitle().subscribe({
      next: (todo) => {
        expect(todo).toEqual(updatedTodo);
      },
      error: (err) => {
        expect(false).withContext("error shouldn't have occured").toBeTrue();
      },
    });

    expect(apiRequestSpy.put).toHaveBeenCalledTimes(1);
    expect(apiRequestSpy.put.calls.mostRecent().args[0]).toBe(
      `/todos/${updatedTodo.ID}`
    );
    expect(apiRequestSpy.put.calls.mostRecent().args[1]).toEqual(form);
  });

  it('should delete todo', () => {
    const todo: Todo = {
      ID: uuid4(),
      Title: 'mock title',
      IsCompleted: true,
      OwnerID: uuid4(),
    };

    const resp = { message: `todo with ID ${todo.ID} deleted` };
    apiRequestSpy.delete.and.returnValue(of(resp));

    const component = TestBed.createComponent(TodoComponent).componentInstance;
    component.id = todo.ID;
    component.title = todo.Title;
    component.isCompleted = todo.IsCompleted;
    component.ownerID = todo.OwnerID;

    component.delete().subscribe({
      next: (msg) => {
        expect(msg).toEqual(resp);
      },
      error: (err) => {
        expect(false).withContext("error shouldn't have occured").toBeTrue();
      },
    });

    expect(apiRequestSpy.delete).toHaveBeenCalledTimes(1);
    expect(apiRequestSpy.delete.calls.mostRecent().args[0]).toBe(
      `/todos/${todo.ID}`
    );
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(TodoComponent);

    const component = fixture.componentInstance;
    component.id = uuid4();
    component.title = 'mock title';
    component.isCompleted = false;
    component.ownerID = uuid4();

    fixture.detectChanges();

    const elem = fixture.nativeElement;
    const titleElem = elem.querySelector('.todo-title');
    expect(titleElem.innerText).toBe(component.title);
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
