import { ComponentFixture, TestBed } from '@angular/core/testing';

import { v4 as uuid4 } from 'uuid';
import { of } from 'rxjs';

import { Todo } from 'src/models/todo';
import { ApiRequestService } from '../api-request.service';
import { TodoContainerComponent } from './todo-container.component';

describe('TodoContainerComponent', () => {
  let component: TodoContainerComponent;
  let fixture: ComponentFixture<TodoContainerComponent>;
  let http: jasmine.SpyObj<ApiRequestService>;

  const _currentOwnerID = uuid4();
  const mockTodos: Todo[] = [
    {
      ID: uuid4(),
      Title: 'Todo 0',
      IsCompleted: false,
      OwnerID: _currentOwnerID,
    },
    {
      ID: uuid4(),
      Title: 'Todo 1',
      IsCompleted: true,
      OwnerID: _currentOwnerID,
    },
    {
      ID: uuid4(),
      Title: 'Todo 2',
      IsCompleted: false,
      OwnerID: _currentOwnerID,
    },
    {
      ID: uuid4(),
      Title: 'Todo 3',
      IsCompleted: true,
      OwnerID: _currentOwnerID,
    },
    {
      ID: uuid4(),
      Title: 'Todo 4',
      IsCompleted: false,
      OwnerID: _currentOwnerID,
    },
    {
      ID: uuid4(),
      Title: 'Todo 5',
      IsCompleted: true,
      OwnerID: _currentOwnerID,
    },
    {
      ID: uuid4(),
      Title: 'Todo 6',
      IsCompleted: false,
      OwnerID: _currentOwnerID,
    },
    {
      ID: uuid4(),
      Title: 'Todo 7',
      IsCompleted: true,
      OwnerID: _currentOwnerID,
    },
    {
      ID: uuid4(),
      Title: 'Todo 8',
      IsCompleted: false,
      OwnerID: _currentOwnerID,
    },
    {
      ID: uuid4(),
      Title: 'Todo 9',
      IsCompleted: true,
      OwnerID: _currentOwnerID,
    },
  ];

  beforeEach(async () => {
    http = jasmine.createSpyObj<ApiRequestService>('ApiRequestService', [
      'get',
    ]);

    http.get.and.returnValue(of(mockTodos));

    await TestBed.configureTestingModule({
      declarations: [TodoContainerComponent],
      providers: [{ provide: ApiRequestService, useValue: http }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should collect todos on init', () => {
    expect(http.get).toHaveBeenCalledTimes(1);
    expect(component.todos).toEqual(mockTodos);
    expect(component.todosToRender).toEqual(mockTodos);
  });

  it("should collect todos on init with 'incomplete' filter", () => {
    const fixture = TestBed.createComponent(TodoContainerComponent);
    let component = fixture.componentInstance;
    component.filter = 'incomplete';
    fixture.detectChanges();

    expect(component.todos).toEqual(mockTodos);
    expect(component.todosToRender).toEqual(
      mockTodos.filter((t) => !t.IsCompleted)
    );
  });

  it("should collect todos on init with 'complete' filter", () => {
    const fixture = TestBed.createComponent(TodoContainerComponent);
    let component = fixture.componentInstance;
    component.filter = 'complete';
    fixture.detectChanges();

    expect(component.todos).toEqual(mockTodos);
    expect(component.todosToRender).toEqual(
      mockTodos.filter((t) => t.IsCompleted)
    );
  });

  it("should render todos with 'all' filter", () => {
    const todoElements = fixture.nativeElement.querySelectorAll(
      '.todo-item'
    ) as HTMLElement[];
    expect(todoElements.length).toEqual(mockTodos.length);

    for (let i = 0; i < todoElements.length; i++) {
      expect(todoElements[i].getAttribute('title')).toBe(mockTodos[i].Title);
    }
  });

  it("should render todos with 'incomplete' filter", () => {
    const fixture = TestBed.createComponent(TodoContainerComponent);
    let component = fixture.componentInstance;
    component.filter = 'incomplete';
    fixture.detectChanges();

    const todoElements = fixture.nativeElement.querySelectorAll(
      '.todo-item'
    ) as HTMLElement[];
    expect(todoElements.length).toEqual(mockTodos.length / 2);
  });

  it("should render todos with 'complete' filter", () => {
    const fixture = TestBed.createComponent(TodoContainerComponent);
    let component = fixture.componentInstance;
    component.filter = 'complete';
    fixture.detectChanges();

    const todoElements = fixture.nativeElement.querySelectorAll(
      '.todo-item'
    ) as HTMLElement[];
    expect(todoElements.length).toEqual(mockTodos.length / 2);
  });
});
