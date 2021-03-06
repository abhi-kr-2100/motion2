import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of, throwError } from 'rxjs';
import { v4 as uuid4 } from 'uuid';

import { ApiRequestService } from '../api-request.service';
import { AuthenticatedUserService } from '../authenticated-user.service';
import { TodoAdderComponent } from './todo-adder.component';
import { Todo } from 'src/models/todo';

describe('TodoAdderComponent', () => {
  let component: TodoAdderComponent;
  let fixture: ComponentFixture<TodoAdderComponent>;
  let loader: HarnessLoader;
  let apiRequestSpy: jasmine.SpyObj<ApiRequestService>;
  let authenticatedUserSpy: jasmine.SpyObj<AuthenticatedUserService>;
  const mockUserID = uuid4();

  beforeEach(async () => {
    apiRequestSpy = jasmine.createSpyObj('ApiRequestService', ['post']);
    authenticatedUserSpy = jasmine.createSpyObj('AuthenticatedUserService', [
      'getUser',
    ]);
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, NoopAnimationsModule],
      declarations: [TodoAdderComponent],
      providers: [
        { provide: ApiRequestService, useValue: apiRequestSpy },
        { provide: AuthenticatedUserService, useValue: authenticatedUserSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    authenticatedUserSpy.getUser.and.returnValue({
      id: mockUserID,
      username: 'test',
      password: 'lalala',
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add component when title is given', () => {
    apiRequestSpy.post.and.returnValue(
      of({
        message: 'created',
      })
    );

    const todoForm = {
      Title: 'mock title',
      IsCompleted: false,
      OwnerID: mockUserID,
    };

    component.newTodoTitle = 'mock title';
    component.createNewTodo();

    expect(authenticatedUserSpy.getUser).toHaveBeenCalled();
    expect(apiRequestSpy.post).toHaveBeenCalledOnceWith('/todos', todoForm);
    expect(component.newTodoTitle).toBe('');
  });

  it('should not add component if title is not given', () => {
    component.newTodoTitle = '';
    component.createNewTodo();

    expect(authenticatedUserSpy.getUser).not.toHaveBeenCalled();
    expect(apiRequestSpy.post).not.toHaveBeenCalled();
    expect(component.newTodoTitle).toBe('');
  });

  it('should preserve old title on failure', () => {
    apiRequestSpy.post.and.returnValue(
      throwError(() => new Error('mock error'))
    );

    component.newTodoTitle = 'mock title';
    component.createNewTodo();

    const todoForm = {
      Title: 'mock title',
      IsCompleted: false,
      OwnerID: mockUserID,
    };

    expect(authenticatedUserSpy.getUser).toHaveBeenCalled();
    expect(apiRequestSpy.post).toHaveBeenCalledOnceWith('/todos', todoForm);
    expect(component.newTodoTitle).toBe('mock title');
  });

  it('should have an add button', () => {
    const addButton =
      fixture.debugElement.nativeElement.querySelector('button');
    expect(addButton).toBeTruthy();
    expect(addButton.textContent).toBe('Add');
  });

  it('should load harness for dialog', async () => {
    component.openDialog();
    const dialog = await loader.getHarness(MatDialogHarness);
    expect(dialog).toBeTruthy();
  });

  it('should be able to close the dialog', async () => {
    component.openDialog();
    const dialog = await loader.getHarness(MatDialogHarness);
    await dialog.close();

    const dialogs = await loader.getAllHarnesses(MatDialogHarness);
    expect(dialogs.length).toBe(0);
  });

  // it('should update newTodoTitle when dialog is closed by cancel button', async () => {
  //   component.openDialog();
  //   const inputBox = await loader.getHarness(MatInputHarness);
  //   const [closeBtn, _] = await loader.getAllHarnesses(MatButtonHarness);

  //   const mockTitle = 'a mock tittle for testing';
  //   await inputBox.setValue(mockTitle);

  //   await closeBtn.click();
  //   expect(component.newTodoTitle).toBe(mockTitle);
  // });

  it('should emit new todo when todo is added', () => {
    const mockNewTodo: Todo = {
      ID: uuid4(),
      Title: 'mock title',
      IsCompleted: false,
      OwnerID: mockUserID,
    };

    apiRequestSpy.post.and.returnValue(of(mockNewTodo));

    spyOn(component.newTodoAdded, 'emit');

    component.newTodoTitle = mockNewTodo.Title;
    component.createNewTodo();
    expect(component.newTodoAdded.emit).toHaveBeenCalledWith(mockNewTodo);
  });
});
