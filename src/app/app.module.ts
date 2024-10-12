import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskListComponent } from './components/task-list/task-list.component';

@NgModule({
  declarations: [AppComponent, TaskFormComponent],
  imports: [BrowserModule, ReactiveFormsModule, TaskListComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
