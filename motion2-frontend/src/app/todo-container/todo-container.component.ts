import { Component, Input, OnInit } from '@angular/core';
import { Todo } from 'src/models/todo';

import { ApiRequestService } from '../api-request.service';

@Component({
  selector: 'app-todo-container',
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.less'],
})
export class TodoContainerComponent implements OnInit {
  @Input() filter: 'all' | 'incomplete' | 'complete' = 'all';

  todos: Todo[] = [];
  todosToRender: Todo[] = [];

  constructor(private http: ApiRequestService) {}

  ngOnInit(): void {
    this.http.get<Todo[]>('/todos').subscribe({
      next: (todos) => {
        this.todos = todos;
        switch (this.filter) {
          case 'all':
            this.todosToRender = this.todos;
            break;
          case 'incomplete':
            this.todosToRender = this.todos.filter((t) => !t.IsCompleted);
            break;
          case 'complete':
            this.todosToRender = this.todos.filter((t) => t.IsCompleted);
            break;
        }
      },
      error: (err) => {
        alert(`Couldn't get todos: ${JSON.stringify(err)}`);
      },
    });
  }
}
