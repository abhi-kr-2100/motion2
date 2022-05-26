import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, of } from 'rxjs';
import { Todo } from 'src/models/todo';

import { ApiRequestService } from '../api-request.service';
import { AuthenticatedUserService } from '../authenticated-user.service';

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

  @Output() statusToggled = new EventEmitter<TodoComponent>();

  toggleCompleted(): Observable<Todo> {
    const form = {
      ID: this.id,
      Title: this.title,
      IsCompleted: !this.isCompleted,
      // In the app, all users must login before they can visit the main todo
      // app. Hence, getUser will never return null.
      OwnerID: this.authenticatedUser.getUser()?.id,
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

  onCheckboxChange(event: MatCheckboxChange) {
    if (this.isCompleted != event.checked) {
      this.toggleCompleted().subscribe({
        next: (updatedTodo) => {
          this.isCompleted = updatedTodo.IsCompleted;
          this.statusToggled.emit(this);
        },
        error: (err) => {
          alert(
            `Couldn't update completion status of todo: ${JSON.stringify(err)}`
          );
        },
      });
    }
  }

  constructor(
    private http: ApiRequestService,
    private authenticatedUser: AuthenticatedUserService
  ) {}

  ngOnInit(): void {}
}
