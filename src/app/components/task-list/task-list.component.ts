import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '@app/task.model';
import { Subscription } from 'rxjs';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="task-list-container">
      <div class="task-list-header">
        <h2>Task List</h2>
        <button (click)="openTaskModal()" class="add-task-button">
          Add Task
        </button>
      </div>
      <div class="task-grid">
        <div class="grid-header">
          <div class="grid-cell">Title</div>
          <div class="grid-cell">Assigned To</div>
          <div class="grid-cell">Status</div>
          <div class="grid-cell">Due Date</div>
          <div class="grid-cell">Priority</div>
          <div class="grid-cell">Actions</div>
        </div>
        <div *ngFor="let task of paginatedTasks" class="grid-row">
          <div class="grid-cell">{{ task.title }}</div>
          <div class="grid-cell">{{ task.assignedTo }}</div>
          <div class="grid-cell">{{ task.status }}</div>
          <div class="grid-cell">{{ task.dueDate | date }}</div>
          <div class="grid-cell">{{ task.priority }}</div>
          <div class="grid-cell">
            <button (click)="openTaskModal(task)" class="edit-button">
              Edit
            </button>
            <button
              (click)="openDeleteConfirmation(task)"
              class="delete-button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div class="pagination">
        <button (click)="prevPage()" [disabled]="currentPage === 1">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button (click)="nextPage()" [disabled]="currentPage === totalPages">
          Next
        </button>
      </div>
    </div>

    <app-task-form
      *ngIf="showTaskModal"
      [showModal]="showTaskModal"
      [taskToEdit]="selectedTask"
      (modalClosed)="closeTaskModal()"
      (taskSaved)="onTaskSaved($event)"
    >
    </app-task-form>

    <!-- Delete Confirmation Popup -->
    <div *ngIf="showDeleteConfirmation" class="modal-overlay">
      <div class="modal-content delete-confirmation">
        <p>Do you want to delete task "{{ taskToDelete?.title }}"?</p>
        <div class="confirmation-buttons">
          <button (click)="confirmDelete()" class="yes-button">Yes</button>
          <button (click)="cancelDelete()" class="no-button">No</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .task-list-container {
        padding: 30px;
      }
      .task-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .add-task-button {
        padding: 10px 20px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .task-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
        gap: 10px;
        margin-bottom: 20px;
      }
      .grid-header,
      .grid-row {
        display: contents;
      }
      .grid-cell {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        display: flex;
        align-items: center;
      }
      .grid-header .grid-cell {
        font-weight: bold;
        background-color: #f0f0f0;
      }
      .edit-button,
      .delete-button {
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
      }
      .edit-button {
        background-color: #4caf50;
        color: white;
      }
      .delete-button {
        background-color: #f44336;
        color: white;
      }
      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .pagination button {
        padding: 5px 10px;
        margin: 0 10px;
      }
      .delete-confirmation {
        text-align: center;
      }

      .confirmation-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
      }

      .yes-button,
      .no-button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .yes-button {
        background-color: #f44336;
        color: white;
      }

      .no-button {
        background-color: #4caf50;
        color: white;
      }
    `,
  ],
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  paginatedTasks: Task[] = [];
  private taskSubscription: Subscription | undefined;

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  showTaskModal = false; // Changed from showAddTaskModal
  selectedTask: Task | null = null;

  showDeleteConfirmation = false;
  taskToDelete: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskSubscription = this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.totalPages = Math.ceil(this.tasks.length / this.pageSize);
      this.updatePaginatedTasks();
    });
  }

  ngOnDestroy() {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  updatePaginatedTasks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTasks = this.tasks.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTasks();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTasks();
    }
  }

  openTaskModal(task: Task | null = null) {
    this.selectedTask = task;
    this.showTaskModal = true;
    console.log('Modal opened', this.showTaskModal);
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.selectedTask = null;
    console.log('Modal closed', this.showTaskModal);
  }

  onTaskSaved(task: Task) {
    if (this.selectedTask) {
      this.taskService.updateTask(task);
    } else {
      this.taskService.addTask(task);
    }
    this.closeTaskModal();
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id);
  }

  editTask(task: Task) {
    // Implement edit functionality
  }

  openDeleteConfirmation(task: Task) {
    this.taskToDelete = task;
    this.showDeleteConfirmation = true;
  }

  confirmDelete() {
    if (this.taskToDelete) {
      this.taskService.deleteTask(this.taskToDelete.id);
      this.showDeleteConfirmation = false;
      this.taskToDelete = null;
    }
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.taskToDelete = null;
  }
}
