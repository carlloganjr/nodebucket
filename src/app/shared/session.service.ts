/*
================================================================
    Title: session.service.ts
    Author: Carl Logan
    Date: 03/24/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) {

  }

  // fetch data from the database
  findEmployeeById(empId: number): Observable<any> {
    return this.http.get('api/employees/' + empId);
  }
}
