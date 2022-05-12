import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { TodoAppComponent } from './todo-app/todo-app.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: TodoAppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
