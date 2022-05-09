import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import Todo from '../models/todo';

const GetTodosURL = 'http://localhost:8080/todos';
const UpdateTodoURL = 'http://localhost:8080/todos/';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(GetTodosURL);
  }

  markCompletionStatus(todo: Todo, isCompleted: boolean): Observable<Todo> {
    const url = UpdateTodoURL + todo.id;

    const updateForm = {
      title: todo.title,
      isCompleted: isCompleted,
      ownerID: todo.ownerID,
    };

    return this.http.put<Todo>(url, updateForm);
  }

  constructor(private http: HttpClient) {}
}
