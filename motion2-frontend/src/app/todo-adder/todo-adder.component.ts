import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TodoService } from '../todo.service';
import Todo from '../../models/todo';

@Component({
  selector: 'app-todo-adder',
  templateUrl: './todo-adder.component.html',
  styleUrls: ['./todo-adder.component.less'],
})
export class TodoAdderComponent implements OnInit {
  addTodo(title: string): Observable<Todo> {
    return this.todoService.addTodo(title);
  }

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {}
}
