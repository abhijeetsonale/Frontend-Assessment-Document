import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskListComponent],
  template: `
    <div class="task-manager">
      <h1>Task Manager</h1>
      <div class="task-container">
        <app-task-form></app-task-form>
        <app-task-list></app-task-list>
      </div>
    </div>
  `,
  styles: [
    `
      .task-manager {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .task-container {
        border: 2px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        background-color: #f9f9f9;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Task Manager';
}
