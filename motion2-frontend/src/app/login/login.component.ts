import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
        headers: {
          Username: this.username,
          Password: this.password,
        },
      })
      .subscribe({
        next: (resp) => {
          this.authenticatedUser.setUser({
            id: resp.id,
            username: this.username,
            password: this.password,
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert(`Login failed: ${err}`);
        },
      });
  }

  constructor(
    private router: Router,
    private http: RawApiRequestService,
    private authenticatedUser: AuthenticatedUserService
  ) {}

  ngOnInit(): void {}
}
