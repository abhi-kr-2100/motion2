import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoComponent } from './todo/todo.component';
import { TodoContainerComponent } from './todo-container/todo-container.component';
import { LoginComponent } from './login/login.component';
import { TodoAppComponent } from './todo-app/todo-app.component';
import { TodoAdderComponent } from './todo-adder/todo-adder.component';
import { TodoAdderDialog } from './todo-adder/todo-adder.dialog';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodoContainerComponent,
    LoginComponent,
    TodoAppComponent,
    TodoAdderComponent,
    TodoAdderDialog,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
