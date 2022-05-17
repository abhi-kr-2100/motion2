import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/models/todo';

import { ApiRequestService } from '../api-request.service';

@Component({
  selector: 'app-todo-container',
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.less'],
})
export class TodoContainerComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private http: ApiRequestService) {}

  ngOnInit(): void {
    this.http.get<Todo[]>('/todos').subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (err) => {
        alert(`Couldn't get todos: ${JSON.stringify(err)}`);
      },
    });
  }
}
