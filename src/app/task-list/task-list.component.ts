import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule,FormsModule],
})
export class TaskListComponent {
  @Input() tasks: any[] = []; // Array of tasks from parent
  @Output() editTask = new EventEmitter<any>();
  //@Output() deleteTask = new EventEmitter<any>();
  // Your task list
  taskToDelete: any = null;
  searchQuery: string = ''; // Used for the search input field
  filteredTasks: any[] = []; // Filtered tasks for the table view
  currentPage: number = 1; // Current page number for pagination
  tasksPerPage: number = 5; // Number of tasks per page
  taskToEdit: any = null;
  isEditModalOpen = false;
  ngOnInit() {
    // Set filteredTasks to the initial tasks
    this.filteredTasks = this.tasks.slice();
  }

  // Emit event to parent component to handle editing the task
  onEdit(task: any) {
    this.taskToEdit = { ...task }; // Clone the task for editing
  }

  confirmEdit() {
    if (this.taskToEdit) {
      const index = this.tasks.findIndex(t => t.id === this.taskToEdit.id);
      if (index > -1) {
        this.tasks[index] = this.taskToEdit; // Update the task
      }
      this.taskToEdit = null; // Reset the task to be edited
      this.editTask.emit(this.taskToEdit); // Emit edit event
    }
  }

  cancelEdit() {
    this.taskToEdit = null; // Reset without editing
  }
  openEditModal(task: any) {
    this.taskToEdit = { ...task }; // Create a copy of the task to edit
    this.isEditModalOpen = true; // Show the modal
}

// Method to close the edit modal
closeEditModal() {
    this.isEditModalOpen = false; // Hide the modal
    this.taskToEdit = null; // Clear the task to edit
}
saveTask() {
  const index = this.tasks.findIndex(t => t.id === this.taskToEdit.id); // Adjust based on your task structure
  if (index !== -1) {
      this.tasks[index] = { ...this.taskToEdit }; // Update the task in the tasks array
  }
  this.closeEditModal(); // Close the modal after saving
}

  // Emit event to parent component to handle deleting the task
  onDelete(task: any) {
    this.taskToDelete = task; // Store the task for confirmation
  }

  // Confirm deletion
  confirmDelete(task: any) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
        this.tasks.splice(index, 1); // Remove the task from the array
        // Uncomment if using deleteTask event
        // this.deleteTask.emit(task);
    }
    this.taskToDelete = null; // Reset the task to be deleted
}
deleteTask() {
  if (this.taskToDelete) {
      this.tasks = this.tasks.filter(t => t.id !== this.taskToDelete.id); // Adjust based on your task structure
      this.taskToDelete = null; // Clear the task to delete
  }
}

  // Cancel deletion
  cancelDelete() {
    this.taskToDelete = null; // Reset without deleting
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
