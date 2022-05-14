import { Component, OnInit } from '@angular/core';
import { ApiRequestService } from '../api-request.service';
import { AuthenticatedUserService } from '../authenticated-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  constructor(
    private http: ApiRequestService,
    private authenticatedUser: AuthenticatedUserService
  ) {}

  ngOnInit(): void {}
}
