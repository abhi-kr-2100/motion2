import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { v4 as uuid4 } from 'uuid';
import { of } from 'rxjs';

import { Todo } from 'src/models/todo';
import { ApiRequestService } from '../api-request.service';
import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let loader: HarnessLoader;
  let apiRequestSpy: jasmine.SpyObj<ApiRequestService>;

  beforeEach(async () => {
    apiRequestSpy = jasmine.createSpyObj<ApiRequestService>(
      'ApiRequestService',
      ['get', 'post', 'put', 'delete']
    );

    await TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [TodoComponent],
      providers: [{ provide: ApiRequestService, useValue: apiRequestSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);

    component = fixture.componentInstance;
    component.id = uuid4();
    component.title = 'mock todo title';
    component.isCompleted = Math.random() >= 0.5;
    component.ownerID = uuid4();

    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle incomplete todo to complete', () => {
    component.isCompleted = false;

    const updatedTodo: Todo = {
      ID: component.id,
      Title: component.title,
      IsCompleted: !component.isCompleted,
      OwnerID: component.ownerID,
    };

    const form = {
      ID: updatedTodo.ID,
      Title: updatedTodo.Title,
      IsCompleted: updatedTodo.IsCompleted,
    };

    apiRequestSpy.put.and.returnValue(of(updatedTodo));

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
    component.isCompleted = true;

    const updatedTodo: Todo = {
      ID: component.id,
      Title: component.title,
      IsCompleted: !component.isCompleted,
      OwnerID: component.ownerID,
    };

    const form = {
      ID: updatedTodo.ID,
      Title: updatedTodo.Title,
      IsCompleted: updatedTodo.IsCompleted,
    };

    apiRequestSpy.put.and.returnValue(of(updatedTodo));

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
      ID: component.id,
      Title: component.title,
      IsCompleted: component.isCompleted,
      OwnerID: component.ownerID,
    };

    const form = {
      ID: updatedTodo.ID,
      Title: updatedTodo.Title,
      IsCompleted: updatedTodo.IsCompleted,
    };

    apiRequestSpy.put.and.returnValue(of(updatedTodo));

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
      ID: component.id,
      Title: component.title,
      IsCompleted: component.isCompleted,
      OwnerID: component.ownerID,
    };

    const resp = { message: `todo with ID ${todo.ID} deleted` };
    apiRequestSpy.delete.and.returnValue(of(resp));

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
    const elem = fixture.nativeElement;
    const titleElem = elem.querySelector('.todo-title');
    expect(titleElem.innerText).toBe(component.title);
  });

  it('should render checkbox for incomplete task', async () => {
    component.isCompleted = false;

    const checkbox = await loader.getHarness(MatCheckboxHarness);
    expect(await checkbox.getLabelText()).toBe(component.title);
    expect(await checkbox.isChecked()).toBe(component.isCompleted);
  });

  it('should render checkbox for completed task', async () => {
    component.isCompleted = true;

    const checkbox = await loader.getHarness(MatCheckboxHarness);
    expect(await checkbox.getLabelText()).toBe(component.title);
    expect(await checkbox.isChecked()).toBe(component.isCompleted);
  });

  it('should render delete button', () => {
    expect(false).toBeTruthy();
  });

  it('should render editable title', () => {
    expect(false).toBeTruthy();
  });
});
