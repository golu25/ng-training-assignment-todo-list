import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { By } from '@angular/platform-browser';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListComponent],
    });

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create the task list component', () => {
    expect(component).toBeTruthy(); // Check if the component is created
  });

  it('should initialize filtered tasks on ngOnInit', () => {
    component.tasks = [
      { id: 1, assignedTo: 'User1' },
      { id: 2, assignedTo: 'User2' },
    ];

    component.ngOnInit(); // Call ngOnInit to initialize

    expect(component.filteredTasks).toEqual(component.tasks); // Expect filteredTasks to be initialized
  });

  it('should emit editTask event when onEdit is called', () => {
    spyOn(component.editTask, 'emit'); // Spy on the emit function

    const task = { id: 1, assignedTo: 'User1' };
    component.onEdit(task); // Call the onEdit method

    expect(component.editTask.emit).toHaveBeenCalledWith(task); // Expect the editTask event to be emitted
  });

  it('should emit deleteTask event when onDelete is called', () => {
    spyOn(component.deleteTask, 'emit'); // Spy on the emit function

    const task = { id: 1, assignedTo: 'User1' };
    component.onDelete(task); // Call the onDelete method

    expect(component.deleteTask.emit).toHaveBeenCalledWith(task); // Expect the deleteTask event to be emitted
  });

  it('should filter tasks based on search query', () => {
    component.tasks = [
      { id: 1, assignedTo: 'User1', status: 'Completed', priority: 'High', comment: 'Test Task' },
      { id: 2, assignedTo: 'User2', status: 'Pending', priority: 'Medium', comment: 'Another Task' },
    ];

    component.searchQuery = 'User1'; // Set search query
    component.onSearch(); // Call the search method

    expect(component.filteredTasks.length).toBe(1); // Expect one task to be filtered
    expect(component.filteredTasks[0].assignedTo).toBe('User1'); // Expect the correct task to be in filteredTasks
  });

  it('should reset filtered tasks when search query is empty', () => {
    component.tasks = [
      { id: 1, assignedTo: 'User1' },
      { id: 2, assignedTo: 'User2' },
    ];

    component.searchQuery = ''; // Set search query to empty
    component.onSearch(); // Call the search method

    expect(component.filteredTasks).toEqual(component.tasks); // Expect filteredTasks to reset to all tasks
  });

  it('should go to the previous page when prevPage is called', () => {
    component.currentPage = 2; // Set current page to 2

    component.prevPage(); // Call the method to go to the previous page

    expect(component.currentPage).toBe(1); // Expect currentPage to be decremented
  });

  it('should not go to the previous page if already on the first page', () => {
    component.currentPage = 1; // Set current page to 1

    component.prevPage(); // Call the method to go to the previous page

    expect(component.currentPage).toBe(1); // Expect currentPage to remain 1
  });

  it('should go to the next page when nextPage is called', () => {
    component.filteredTasks = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, assignedTo: `User${i + 1}` }));
    component.tasksPerPage = 5; // Set tasks per page
    component.currentPage = 1; // Set current page to 1

    component.nextPage(); // Call the method to go to the next page

    expect(component.currentPage).toBe(2); // Expect currentPage to be incremented
  });

  it('should not go to the next page if already on the last page', () => {
    component.filteredTasks = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, assignedTo: `User${i + 1}` }));
    component.tasksPerPage = 5; // Set tasks per page
    component.currentPage = 2; // Set current page to 2

    component.nextPage(); // Call the method to go to the next page

    expect(component.currentPage).toBe(2); // Expect currentPage to remain the same
  });

  it('should return current page tasks', () => {
    component.filteredTasks = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, assignedTo: `User${i + 1}` }));
    component.tasksPerPage = 5; // Set tasks per page
    component.currentPage = 1; // Set current page to 1

    const currentPageTasks = component.getCurrentPageTasks(); // Get current page tasks

    expect(currentPageTasks.length).toBe(5); // Expect to get 5 tasks for page 1
  });
});
