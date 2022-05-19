import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { TodoAdderDialog } from './todo-adder.dialog';
import { ApiRequestService } from '../api-request.service';
import { AuthenticatedUserService } from '../authenticated-user.service';

@Component({
  selector: 'app-todo-adder',
  templateUrl: './todo-adder.component.html',
  styleUrls: ['./todo-adder.component.less'],
})
export class TodoAdderComponent implements OnInit {
  newTodoTitle: string = '';

  createNewTodo() {
    if (this.newTodoTitle.trim() === '') {
      return;
    }

    const todoForm = {
      Title: this.newTodoTitle,
      IsCompleted: false,
      // getUser should always return a user object
      OwnerID: this.authenticatedUser.getUser()?.id,
    };

    this.http.post('/todos', todoForm).subscribe({
      next: (_) => {
        this.newTodoTitle = '';
        // TODO: Add the new todo to the list of all available todos
      },
      error: (err) => {
        alert(
          `Couldn't add new todo ${this.newTodoTitle}: ${JSON.stringify(err)}`
        );
      },
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: this.newTodoTitle };

    const dialogRef = this.dialog.open(TodoAdderDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.newTodoTitle = result.title;
      if (result.added) {
        this.createNewTodo();
      }
    });
  }

  constructor(
    private http: ApiRequestService,
    private authenticatedUser: AuthenticatedUserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}
}
