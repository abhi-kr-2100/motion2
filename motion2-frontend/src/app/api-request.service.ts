import { Injectable } from '@angular/core';

import { throwError } from 'rxjs';

import { AuthenticatedUserService } from './authenticated-user.service';
import { LoggedInUser } from '../models/user';
import { RawApiRequestService } from './raw-api-request.service';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  private _getOptions() {
    const user: LoggedInUser | null = this.authenticatedUser.getUser();
    if (user === null) {
      return null;
    }

    return { headers: { Username: user.username, Password: user.password } };
  }

  get<T>(url: string) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    return this.http.get<T>(url, options);
  }

  post<T>(url: string, body?: any) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    return this.http.post<T>(url, body, options);
  }

  put<T>(url: string, body?: any) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    return this.http.put<T>(url, body, options);
  }

  delete<T>(url: string) {
    const options = this._getOptions();
    if (options === null) {
      return throwError(() => new Error('No authenticated user found'));
    }

    return this.http.delete<T>(url, options);
  }

  constructor(
    private http: RawApiRequestService,
    private authenticatedUser: AuthenticatedUserService
  ) {}
}
