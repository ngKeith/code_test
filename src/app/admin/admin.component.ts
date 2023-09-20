import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { RegisterUser } from '../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  routes: Routes = [
    { path: 'users', component: UsersComponent },
    { path: 'registerUser', component: RegisterUser },
  ];
}
