import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: any[] = []; // Array of tasks
  private tasksSubject = new BehaviorSubject<any[]>(this.tasks);

  tasks$ = this.tasksSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Optional: Initialize with some tasks for testing
    if (isPlatformBrowser(this.platformId)) { // Check if running in browser
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      }
    } else {
      // Fallback tasks for non-browser environments (like SSR)
      this.tasks = [
        { id: 1, assignedTo: 'User1', status: 'Completed', dueDate: '2024-01-01', priority: 'High', comment: 'Task 1' },
        // Add more sample tasks if needed
      ];
    }
    this.tasksSubject.next(this.tasks); // Emit the initial tasks
  }

  getTasks(): Observable<any[]> {
    return this.tasksSubject.asObservable(); // Return the tasks as observable
  }

  createTask(task: any) {
    task.id = this.tasks.length + 1; 
    this.tasks.push(task);
    this.tasksSubject.next(this.tasks); 
    this.saveTasksToLocalStorage();
  }

  updateTask(updatedTask: any) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.tasksSubject.next(this.tasks); 
      this.saveTasksToLocalStorage();
    }
  }

  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.tasksSubject.next(this.tasks); 
    this.saveTasksToLocalStorage();
  }

  private saveTasksToLocalStorage() {
    if (isPlatformBrowser(this.platformId)) { // Check if running in browser
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }
}
