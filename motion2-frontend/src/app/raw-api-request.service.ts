import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RawApiRequestService {
  baseURL = 'http://localhost:8080';

  get<T>(url: string, option?: any): Observable<any> {
    const fullURL = this.baseURL + url;
    return this.http.get<T>(fullURL, option);
  }

  post<T>(url: string, body?: any, option?: any): Observable<any> {
    const fullURL = this.baseURL + url;
    return this.http.post<T>(fullURL, body, option);
  }

  put<T>(url: string, body?: any, option?: any): Observable<any> {
    const fullURL = this.baseURL + url;
    return this.http.put<T>(fullURL, body, option);
  }

  delete<T>(url: string, option?: any): Observable<any> {
    const fullURL = this.baseURL + url;
    return this.http.delete<T>(fullURL, option);
  }

  constructor(private http: HttpClient) {}
}
