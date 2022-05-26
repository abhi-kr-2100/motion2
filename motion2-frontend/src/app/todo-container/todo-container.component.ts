import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Todo } from 'src/models/todo';

import { ApiRequestService } from '../api-request.service';
import { TodoComponent } from '../todo/todo.component';

@Component({
  selector: 'app-todo-container',
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.less'],
})
export class TodoContainerComponent implements OnInit {
  @Input() filter: string = 'all';

  todos: Todo[] = [];
  todosToRender: Todo[] = [];

  constructor(private http: ApiRequestService) {}

  ngOnInit(): void {
    this.http.get<Todo[]>('/todos').subscribe({
      next: (todos) => {
        this.todos = todos;
        this.todosToRender = todos;
      },
      error: (err) => {
        alert(`Couldn't get todos: ${JSON.stringify(err)}`);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
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
  }

  todoStatusChanged(todo: TodoComponent) {
    for (let t of this.todos) {
      if (t.ID === todo.id) {
        t.IsCompleted = todo.isCompleted;
        this.ngOnChanges({});
        return;
      }
    }
  }
}
