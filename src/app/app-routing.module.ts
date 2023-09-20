import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './account/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterUserComponent } from './admin/register-user/register-user.component';
import { UsersComponent } from './admin/users/users.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'account', component: AccountComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'registerUser', component: RegisterUserComponent },
  { path: 'users', component: UsersComponent },
  { path: 'main', component: MainComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
