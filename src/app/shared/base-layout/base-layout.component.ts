/*
================================================================
    Title: base-layout.component.ts
    Author: Carl Logan
    Date: 03/24/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  sessionName: string;
  year: number;

  // get the session name for use in the base layout template
  constructor(private cookieService: CookieService, private router: Router) {
    this.sessionName = this.cookieService.get('session_name');
    this.year = Date.now();
  }

  ngOnInit(): void {
  }

  // delete the cookies and route to the log in page
  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }
}
