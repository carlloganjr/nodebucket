/*
================================================================
    Title: app-routing.module.ts
    Author: Carl Logan
    Date: 03/24/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseLayoutComponent} from "./shared/base-layout/base-layout.component";
import {HomeComponent} from "./pages/home/home.component";
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  // set the home page route but with the condition of logging in first
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contact',
        component: ContactComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'about',
        component: AboutComponent,
        canActivate: [AuthGuard]
      }
    ]
  },

  {
    path: 'session',
    component: AuthLayoutComponent,
    children: [
      // the initial page route that users will see to login in to the home page
      {
        path: 'login',
        component: LoginComponent
      },
      // for any pages not included in the routes
      {
        path: 'not-found',
        component: NotFoundComponent,
      }
    ]
  },

  // routing any addresses that are not valid
  {path: '**', redirectTo: 'session/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
