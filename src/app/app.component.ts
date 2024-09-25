import { Component, OnInit } from '@angular/core';
import { TaskService } from './task.service';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [TaskListComponent, TaskFormComponent, CommonModule],
})
export class AppComponent implements OnInit {
  showForm = false;
  showTaskList = true;
  tasks: any[] = [];
  filteredTasks: any[] = [];
  selectedTask: any = null;
  searchQuery: string = '';
  menuOpen = false;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      (tasks) => {
        console.log('Tasks fetched:', tasks); // Debug log
        this.tasks = tasks;
        this.filteredTasks = tasks; // Reset filtered tasks to show all tasks
      },
      (error) => {
        console.error('Error fetching tasks:', error); // Handle errors
      }
    );
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase(); // Get the search query
    if (query.trim() === '') {
      this.filteredTasks = this.tasks; // Reset to all tasks if query is empty
    } else {
      this.filteredTasks = this.tasks.filter((task) =>
        task.assignedTo?.toLowerCase().includes(query) // Safely check if task.assignedTo exists
      );
    }
  }

  onNewTask() {
    this.selectedTask = null; // Reset selected task for new task
    this.showForm = true;
    this.showTaskList = false;
  }

  onEditTask(task: any) {
    this.selectedTask = task; // Set selected task for editing
    this.showForm = true;
    this.showTaskList = false;
  }

  onSaveTask(task: any) {
    if (this.selectedTask) {
      this.taskService.updateTask({ ...this.selectedTask, ...task });
    } else {
      this.taskService.createTask(task);
    }
    this.onCloseForm();
    this.loadTasks(); // Reload tasks after save to reflect changes
  }

  onCloseForm() {
    this.showForm = false;
    this.showTaskList = true;
    this.selectedTask = null; // Reset selected task
  }

  onDeleteTask(task: any) {
    this.taskService.deleteTask(task.id);
    this.loadTasks(); // Reload tasks after deletion
  }
}
