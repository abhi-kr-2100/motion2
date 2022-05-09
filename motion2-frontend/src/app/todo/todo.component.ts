import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less'],
})
export class TodoComponent implements OnInit {
  isCompleted: boolean = false;

  toggleCompletionStatus(): void {
    this.isCompleted = !this.isCompleted;
  }

  constructor() {}

  ngOnInit(): void {}
}
