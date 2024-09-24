import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule],
})
export class TaskListComponent {
  @Input() tasks: any[] = []; // Array of tasks from parent
  @Output() editTask = new EventEmitter<any>();
  @Output() deleteTask = new EventEmitter<any>();

  searchQuery: string = ''; // Used for the search input field
  filteredTasks: any[] = []; // Filtered tasks for the table view
  currentPage: number = 1; // Current page number for pagination
  tasksPerPage: number = 5; // Number of tasks per page

  ngOnInit() {
    // Set filteredTasks to the initial tasks
    this.filteredTasks = this.tasks.slice();
  }

  // Emit event to parent component to handle editing the task
  onEdit(task: any) {
    this.editTask.emit(task);
  }

  // Emit event to parent component to handle deleting the task
  onDelete(task: any) {
    this.deleteTask.emit(task);
  }

  // Search function to filter tasks based on search input
  onSearch() {
    if (this.searchQuery.trim()) {
      this.filteredTasks = this.tasks.filter(task => 
        task.assignedTo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.status.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.priority.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.comment.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredTasks = this.tasks.slice(); // Reset to all tasks when search query is empty
    }
  }

  // Pagination control to go to the previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Pagination control to go to the next page
  nextPage() {
    const totalPages = Math.ceil(this.filteredTasks.length / this.tasksPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  // Get the current page's tasks
  getCurrentPageTasks() {
    const startIndex = (this.currentPage - 1) * this.tasksPerPage;
    const endIndex = startIndex + this.tasksPerPage;
    return this.filteredTasks.slice(startIndex, endIndex);
  }
}
