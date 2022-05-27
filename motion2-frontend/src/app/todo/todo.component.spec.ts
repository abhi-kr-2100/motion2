import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import {
  MatCheckbox,
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';

import { v4 as uuid4 } from 'uuid';
import { of } from 'rxjs';

import { Todo } from 'src/models/todo';
import { ApiRequestService } from '../api-request.service';
import { AuthenticatedUserService } from '../authenticated-user.service';
import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let loader: HarnessLoader;
  let apiRequestSpy: jasmine.SpyObj<ApiRequestService>;
  let authenticatedUserSpy: jasmine.SpyObj<AuthenticatedUserService>;

  beforeEach(async () => {
    apiRequestSpy = jasmine.createSpyObj<ApiRequestService>(
      'ApiRequestService',
      ['get', 'post', 'put', 'delete']
    );
    authenticatedUserSpy = jasmine.createSpyObj('AuthenticatedUserService', [
      'getUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [TodoComponent],
      providers: [
        { provide: ApiRequestService, useValue: apiRequestSpy },
        { provide: AuthenticatedUserService, useValue: authenticatedUserSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);

    component = fixture.componentInstance;
    component.id = uuid4();
    component.title = 'mock todo title';
    component.isCompleted = Math.random() >= 0.5;
    component.ownerID = uuid4();

    authenticatedUserSpy.getUser.and.returnValue({
      id: component.ownerID,
      username: 'mock',
      password: 'letmein',
    });

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
      OwnerID: updatedTodo.OwnerID,
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
      OwnerID: updatedTodo.OwnerID,
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

  it('should complete task on check', async () => {
    component.isCompleted = false;

    const updatedTodo: Todo = {
      ID: component.id,
      Title: component.title,
      IsCompleted: !component.isCompleted,
      OwnerID: component.ownerID,
    };

    apiRequestSpy.put.and.returnValue(of(updatedTodo));

    const checkbox = await loader.getHarness(MatCheckboxHarness);
    await checkbox.toggle();

    expect(await checkbox.isChecked()).toBe(updatedTodo.IsCompleted);
    expect(component.isCompleted).toBe(updatedTodo.IsCompleted);
  });

  it('should mark completed task incomplete on check remove', async () => {
    component.isCompleted = true;

    const updatedTodo: Todo = {
      ID: component.id,
      Title: component.title,
      IsCompleted: !component.isCompleted,
      OwnerID: component.ownerID,
    };

    apiRequestSpy.put.and.returnValue(of(updatedTodo));

    const checkbox = await loader.getHarness(MatCheckboxHarness);
    await checkbox.toggle();

    expect(await checkbox.isChecked()).toBe(updatedTodo.IsCompleted);
    expect(component.isCompleted).toBe(updatedTodo.IsCompleted);
  });

  it('should render delete button', () => {
    const deleteButton = fixture.nativeElement.querySelector('.delete-button');
    expect(deleteButton).toBeTruthy();
  });

  it('should delete todo when delete button is clicked', () => {
    spyOn(component, 'delete');

    const deleteBtn = fixture.nativeElement.querySelector('.delete-button');
    deleteBtn.click();

    expect(component.delete).toHaveBeenCalledTimes(1);
  });

  it('should emit delete event when delete button is clicked', () => {
    spyOn(component.todoDeleted, 'emit');
    apiRequestSpy.delete.and.returnValue(of({ message: 'deleted' }));

    const deleteBtn = fixture.nativeElement.querySelector('.delete-button');
    deleteBtn.click();

    expect(component.todoDeleted.emit).toHaveBeenCalledOnceWith(component);
  });

  it('should render editable title', () => {
    expect(false).toBeTruthy();
  });

  it('should emit event on todo completion status change', () => {
    const mockUpdatedTodo: Todo = {
      ID: component.id,
      Title: component.title,
      IsCompleted: !component.isCompleted,
      OwnerID: component.ownerID,
    };

    apiRequestSpy.put.and.returnValue(of(mockUpdatedTodo));
    let mockEvent = new MatCheckboxChange();
    mockEvent.checked = mockUpdatedTodo.IsCompleted;

    spyOn(component.statusToggled, 'emit');

    component.onCheckboxChange(mockEvent);
    expect(component.statusToggled.emit).toHaveBeenCalledOnceWith(component);
  });
});
