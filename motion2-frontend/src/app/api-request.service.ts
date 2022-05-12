import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthenticatedUserService } from './authenticated-user.service';
import { LoggedInUser } from '../models/user';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  baseURL = 'http://localhost:4200/';

  _getOptions() {
    const user: LoggedInUser | null = this.authenticatedUser.getUser();
    if (user === null) {
      return null;
    }

    return { headers: { Username: user.username, Password: user.password } };
  }

  getWithHeaders(url: string, headers: any) {
    const fullURL = this.baseURL + url;
    return this.http.get(fullURL, { headers: headers });
  }

  get(url: string) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    const fullURL = this.baseURL + url;
    return this.http.get(fullURL, options);
  }

  post(url: string, body?: any) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    const fullURL = this.baseURL + url;
    return this.http.post(fullURL, body, options);
  }

  put(url: string, body?: any) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    const fullURL = this.baseURL + url;
    return this.http.put(fullURL, body, options);
  }

  delete(url: string) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    const fullURL = this.baseURL + url;
    return this.http.delete(fullURL, options);
  }

  constructor(
    private http: HttpClient,
    private authenticatedUser: AuthenticatedUserService
  ) {}
}
