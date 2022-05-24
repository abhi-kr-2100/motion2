import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.less'],
})
export class TodoAppComponent implements OnInit {
  filters = ['all', 'incomplete', 'complete'];
  selectedFilter = this.filters[0];

  selectFilter(filter: string) {
    this.selectedFilter = filter;
  }

  constructor() {}
  ngOnInit(): void {}
}
