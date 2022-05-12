import { Component, OnInit } from '@angular/core';

import { ApiRequestService } from '../api-request.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less'],
})
export class TodoComponent implements OnInit {
  constructor(private http: ApiRequestService) {}

  ngOnInit(): void {}
}
