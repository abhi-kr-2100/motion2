import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from 'src/models/todo';

import { ApiRequestService } from '../api-request.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less'],
})
export class TodoComponent implements OnInit {
  @Input() id!: string;
  @Input() title!: string;
  @Input() isCompleted!: boolean;
  @Input() ownerID!: string;

  toggleCompleted(): Observable<Todo> {
    const form = {
      ID: this.id,
      Title: this.title,
      IsCompleted: !this.isCompleted,
    };

    return this.http.put<Todo>(`/todos/${this.id}`, form);
  }

  updateTitle(): Observable<Todo> {
    const form = {
      ID: this.id,
      Title: this.title,
      IsCompleted: this.isCompleted,
    };

    return this.http.put<Todo>(`/todos/${this.id}`, form);
  }

  delete() {
    return this.http.delete(`/todos/${this.id}`);
  }

  constructor(private http: ApiRequestService) {}

  ngOnInit(): void {}
}
