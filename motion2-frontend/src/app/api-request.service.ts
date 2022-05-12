import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  baseURL = 'http://localhost:4200/';

  getWithHeaders(url: string, headers: any) {
    const fullURL = this.baseURL + url;
    return this.http.get(fullURL, { headers });
  }

  constructor(private http: HttpClient) {}
}
