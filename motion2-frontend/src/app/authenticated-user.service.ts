import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { RawApiRequestService } from './raw-api-request.service';
import { LoggedInUser } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedUserService {
  setUser(user: LoggedInUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): LoggedInUser | null {
    const user = localStorage.getItem('user');
    if (user === null) {
      return null;
    }

    return JSON.parse(user);
  }

  verify(): Observable<any> {
    const cache = this.getUser();
    if (cache === null) {
      return throwError(() => {
        'User not logged in';
      });
    }

    return this.http.get('/users/login', {
      headers: { Username: cache.username, Password: cache.password },
    });
  }

  constructor(private http: RawApiRequestService) {}
}
