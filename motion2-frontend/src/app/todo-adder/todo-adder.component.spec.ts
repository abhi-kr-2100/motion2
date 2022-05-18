import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';
import { v4 as uuid4 } from 'uuid';

import { ApiRequestService } from '../api-request.service';
import { AuthenticatedUserService } from '../authenticated-user.service';
import { TodoAdderComponent } from './todo-adder.component';

describe('TodoAdderComponent', () => {
  let component: TodoAdderComponent;
  let fixture: ComponentFixture<TodoAdderComponent>;
  let apiRequestSpy: jasmine.SpyObj<ApiRequestService>;
  let authenticatedUserSpy: jasmine.SpyObj<AuthenticatedUserService>;
  const mockUserID = uuid4();

  beforeEach(async () => {
    apiRequestSpy = jasmine.createSpyObj('ApiRequestService', ['post']);
    authenticatedUserSpy = jasmine.createSpyObj('AuthenticatedUserService', [
      'getUser',
    ]);
    await TestBed.configureTestingModule({
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
});
