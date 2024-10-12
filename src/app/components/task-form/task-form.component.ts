import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '@app/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ taskToEdit ? 'Edit Task' : 'Add New Task' }}</h2>
        <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
          <table class="task-form-table">
            <tr>
              <td><label for="title">Title:</label></td>
              <td>
                <input
                  type="text"
                  id="title"
                  name="title"
                  [(ngModel)]="task.title"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label for="assignedTo">Assigned To:</label></td>
              <td>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  [(ngModel)]="task.assignedTo"
                />
              </td>
            </tr>
            <tr>
              <td><label for="status">Status:</label></td>
              <td>
                <select
                  id="status"
                  name="status"
                  [(ngModel)]="task.status"
                  required
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label for="dueDate">Due Date:</label></td>
              <td>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  [(ngModel)]="task.dueDate"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label for="priority">Priority:</label></td>
              <td>
                <select
                  id="priority"
                  name="priority"
                  [(ngModel)]="task.priority"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </td>
            </tr>
          </table>
          <div class="form-actions">
            <button type="submit" [disabled]="!taskForm.form.valid">
              {{ taskToEdit ? 'Update' : 'Add' }} Task
            </button>
            <button type="button" (click)="onCancel()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        width: 400px;
        max-width: 90%;
      }
      .task-form-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 10px;
      }
      .task-form-table td {
        padding: 5px;
      }
      .task-form-table td:first-child {
        width: 30%;
        text-align: right;
      }
      .task-form-table input,
      .task-form-table select {
        width: 100%;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .form-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }
      button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button[type='submit'] {
        background-color: #4caf50;
        color: white;
      }
      button[type='button'] {
        background-color: #f44336;
        color: white;
      }
    `,
  ],
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() showModal = false;
  @Input() taskToEdit: Task | null = null;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() taskSaved = new EventEmitter<Task>();
  @Output() taskAdded = new EventEmitter<any>();

  task: Task = {
    id: 0,
    title: '',
    assignedTo: '',
    status: 'Not Started',
    dueDate: new Date(),
    priority: 'Medium',
    comments: '',
    completed: false,
  };
  taskForm: any;

  ngOnInit() {
    console.log('TaskFormComponent initialized', this.showModal);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('TaskFormComponent changes', changes);
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.task = { ...this.taskToEdit };
    } else if (changes['showModal'] && this.showModal) {
      this.resetForm();
    }
  }

  resetForm() {
    this.task = {
      id: 0,
      title: '',
      assignedTo: '',
      status: 'Not Started',
      dueDate: new Date(),
      priority: 'Medium',
      comments: '',
      completed: false,
    };
  }

  onSubmit() {
    this.taskSaved.emit(this.task);
    this.modalClosed.emit();
  }

  onCancel() {
    this.modalClosed.emit();
  }
}
