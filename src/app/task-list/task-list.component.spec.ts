import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;

    // Initialize some sample tasks
    component.tasks = [
      { id: 1, assignedTo: 'User1', status: 'Completed', dueDate: '2024-01-01', priority: 'High', comment: 'Task 1' },
      { id: 2, assignedTo: 'User2', status: 'Pending', dueDate: '2024-01-02', priority: 'Medium', comment: 'Task 2' },
    ];
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm edit and update the task', () => {
    component.taskToEdit = { id: 1, assignedTo: 'User1', status: 'In Progress', dueDate: '2024-01-01', priority: 'High', comment: 'Updated Task 1' };
    component.confirmEdit();

    const updatedTask = component.tasks.find(task => task.id === 1);
    expect(updatedTask?.status).toBe('In Progress'); // Check if the status was updated
    expect(updatedTask?.comment).toBe('Updated Task 1'); // Check if the comment was updated
  });

  it('should cancel edit and not change the task', () => {
    const originalTask = { ...component.tasks[0] }; // Store original task
    component.taskToEdit = { id: 1, assignedTo: 'User1', status: 'In Progress', dueDate: '2024-01-01', priority: 'High', comment: 'Updated Task 1' };
    component.cancelEdit();

    const currentTask = component.tasks.find(task => task.id === 1);
    expect(currentTask).toEqual(originalTask); // Check if the original task is unchanged
  });

  it('should open the edit modal with the correct task', () => {
    component.openEditModal(component.tasks[0]);
    expect(component.taskToEdit).toEqual(component.tasks[0]); // Ensure the task to edit is set correctly
    expect(component.isEditModalOpen).toBeTrue(); // Ensure the modal is opened
  });

  it('should close the edit modal', () => {
    component.taskToEdit = { id: 1, assignedTo: 'User1', status: 'In Progress', dueDate: '2024-01-01', priority: 'High', comment: 'Updated Task 1' }; // Set a task to edit
    component.closeEditModal();
    expect(component.isEditModalOpen).toBeFalse(); // Ensure the modal is closed
    expect(component.taskToEdit).toBeNull(); // Ensure task to edit is cleared
  });

  it('should emit delete event', () => {
    spyOn(component, 'onDelete').and.callThrough();
    component.onDelete(component.tasks[0]);
    expect(component.taskToDelete).toEqual(component.tasks[0]); // Ensure the correct task is set for deletion
  });

  it('should confirm delete', () => {
    const taskToDelete = { id: 2, assignedTo: 'User2', status: 'Pending', dueDate: '2024-01-02', priority: 'Medium', comment: 'Task 2' };
    component.confirmDelete(taskToDelete);
    expect(component.tasks.length).toBe(1); // Ensure one task is removed
    expect(component.tasks[0].id).toBe(1); // Ensure the remaining task is the first one
  });

  it('should cancel deletion', () => {
    component.cancelDelete();
    expect(component.taskToDelete).toBeNull(); // Ensure the task to delete is cleared
  });

  it('should search tasks', () => {
    component.searchQuery = 'User1';
    component.onSearch();
    expect(component.filteredTasks.length).toBe(1); // Ensure only one task matches the search
    expect(component.filteredTasks[0].assignedTo).toBe('User1'); // Ensure the correct task is returned
  });
});
