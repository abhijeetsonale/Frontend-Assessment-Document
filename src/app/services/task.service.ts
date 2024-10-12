import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '@app/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor() {
    this.updateTasks();
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task): void {
    this.tasks.push(task);
    this.updateTasks();
    console.log('Tasks after adding:', this.tasks); // Add this line for debugging
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.updateTasks();
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.updateTasks();
  }

  private updateTasks(): void {
    this.tasksSubject.next([...this.tasks]);
    console.log('Tasks updated:', this.tasks); // Add this line for debugging
  }
}
