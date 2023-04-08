/*
================================================================
    Title: task.service.ts
    Author: Carl Logan
    Date: 03/29/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './models/item.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  // request data using the nodebucket API
  findAllTasks(empId: number): Observable<any> {
    return this.http.get(`/api/employees/${empId}/tasks`);
  }

  // post data using the nodebucket API
  createTask(empId: number, task: string): Observable<any>  {
    return this.http.post(`/api/employees/${empId}/tasks`, {
      text: task
    });
  }

  // put data using the nodebucket API
  updateTask(empId: number, todo: Item[], done: Item[]): Observable<any> {
    return this.http.put(`/api/employees/${empId}/tasks`, {
      todo,
      done
    });
  }

  // delete data using the nodebucket API
  deleteTask(empId: number, taskId: string): Observable<any> {
    return this.http.delete(`/api/employees/${empId}/tasks/${taskId}`);
  }
}

