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

  getWithHeaders<T>(url: string, headers: any) {
    const fullURL = this.baseURL + url;
    return this.http.get<T>(fullURL, { headers: headers });
  }

  get<T>(url: string) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    const fullURL = this.baseURL + url;
    return this.http.get<T>(fullURL, options);
  }

  post<T>(url: string, body?: any) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    const fullURL = this.baseURL + url;
    return this.http.post<T>(fullURL, body, options);
  }

  put<T>(url: string, body?: any) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    const fullURL = this.baseURL + url;
    return this.http.put<T>(fullURL, body, options);
  }

  delete<T>(url: string) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    const fullURL = this.baseURL + url;
    return this.http.delete<T>(fullURL, options);
  }

  constructor(
    private http: HttpClient,
    private authenticatedUser: AuthenticatedUserService
  ) {}
}
