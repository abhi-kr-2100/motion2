import { Injectable } from '@angular/core';

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

  constructor() {}
}
