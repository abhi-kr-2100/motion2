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

    return this.http.post<Todo>('/todos', form);
  }

  updateTitle(): Observable<Todo> {
    const form = {
      ID: this.id,
      Title: this.title,
      IsCompleted: this.isCompleted,
    };

    return this.http.post<Todo>('/todos', form);
  }

  constructor(private http: ApiRequestService) {}

  ngOnInit(): void {}
}
