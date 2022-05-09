import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less'],
})
export class TodoComponent implements OnInit {
  // TODO: Verify that uuid is valid
  @Input() uuid!: string;

  @Input() isCompleted!: boolean;
  @Input() title!: string;

  toggleCompletionStatus(): void {
    this.isCompleted = !this.isCompleted;
    // TODO: Send an API request to update the todo's completion status
  }

  constructor() {}

  ngOnInit(): void {}
}
