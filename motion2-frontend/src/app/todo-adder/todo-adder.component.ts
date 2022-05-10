import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { TodoService } from '../todo.service';
import { TodoAdderDialog } from '../todo-adder-dialog/todo-adder-dialog.component';
import Todo from '../../models/todo';

@Component({
  selector: 'app-todo-adder',
  templateUrl: './todo-adder.component.html',
  styleUrls: ['./todo-adder.component.less'],
})
export class TodoAdderComponent implements OnInit {
  title: string = '';

  addTodo(title: string): Observable<Todo> {
    return this.todoService.addTodo(title);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TodoAdderDialog, {
      data: this.title,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== '') {
        this.addTodo(result).subscribe((todo) => {
          this.title = '';
          console.log(`Added todo: ${todo.Title}`);
        });

        // TODO: Update the existing list of todos
      }
    });
  }

  constructor(private todoService: TodoService, private dialog: MatDialog) {}

  ngOnInit(): void {}
}
