import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  login() {
    // TODO: Implement login
    console.log('Trying to log in...');
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
}
