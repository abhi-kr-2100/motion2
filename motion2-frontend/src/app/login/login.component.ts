import { Component, OnInit } from '@angular/core';

import { RawApiRequestService } from '../raw-api-request.service';
import { AuthenticatedUserService } from '../authenticated-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  login() {
    if (this.username.trim() === '' || this.password.trim() === '') {
      return;
    }

    this.http
      .get(`/users/login`, {
        Username: this.username,
        Password: this.password,
      })
      .subscribe({
        next: (_) => {
          this.authenticatedUser.setUser({
            username: this.username,
            password: this.password,
          });
        },
        error: (err) => {
          alert(`Login failed: ${err}`);
        },
      });
  }

  constructor(
    private http: RawApiRequestService,
    private authenticatedUser: AuthenticatedUserService
  ) {}

  ngOnInit(): void {}
}
