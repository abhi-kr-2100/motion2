import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import Todo from '../models/todo';

const GetTodosURL = 'http://localhost:8080/todos';
const AddTodoURL = 'http://localhost:8080/todos';
const UpdateTodoURL = 'http://localhost:8080/todos/';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  addTodo(title: string): Observable<Todo> {
    const form: Todo = {
      // Not used by the backend
      ID: '',

      Title: title,
      IsCompleted: false,

      // TODO: Add ownerID
      OwnerID: '',
    };

    return this.http.post<Todo>(AddTodoURL, form);
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(GetTodosURL);
  }

  markCompletionStatus(todo: Todo, isCompleted: boolean): Observable<Todo> {
    const url = UpdateTodoURL + todo.ID;

    const updateForm = {
      title: todo.Title,
      isCompleted: isCompleted,
      ownerID: todo.OwnerID,
    };

    return this.http.put<Todo>(url, updateForm);
  }

  constructor(private http: HttpClient) {}
}
