import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiRequestService } from '../api-request.service';

import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let apiRequestSpy = jasmine.createSpyObj<ApiRequestService>(
    'ApiRequestService',
    ['get', 'post', 'put', 'delete']
  );

  beforeEach(async () => {
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

  it('should toggle completed', () => {
    expect(false).toBeTruthy();
  });

  it('should change title', () => {
    expect(false).toBeTruthy();
  });

  it('should delete todo', () => {
    expect(false).toBeTruthy();
  });

  it('should render title', () => {
    expect(false).toBeTruthy();
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
