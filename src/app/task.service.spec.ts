import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

describe('TaskService', () => {
  let service: TaskService;

  // Mock localStorage
  const mockLocalStorage = {
    getItem: jasmine.createSpy('getItem').and.callFake((key: string) => {
      return key === 'tasks' ? JSON.stringify([{ id: 1, assignedTo: 'User1', status: 'Completed', dueDate: '2024-01-01', priority: 'High', comment: 'Task 1' }]) : null;
    }),
    setItem: jasmine.createSpy('setItem'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: PLATFORM_ID, useValue: 'browser' }, // Mock PLATFORM_ID
      ],
    });

    // Replace the global localStorage with the mock
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);

    service = TestBed.inject(TaskService); // Get the instance of TaskService
  });

  it('should retrieve tasks from localStorage when available', (done) => {
    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(1); // Check if one task is retrieved
      expect(tasks[0]).toEqual({ id: 1, assignedTo: 'User1', status: 'Completed', dueDate: '2024-01-01', priority: 'High', comment: 'Task 1' }); // Check the task details
      done();
    });
  });

  it('should save tasks to localStorage', () => {
    const task = { assignedTo: 'User2', status: 'In Progress', dueDate: '2024-02-01', priority: 'Normal', comment: 'Task 2' };
    service.createTask(task); // Create a new task
    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', jasmine.any(String)); // Check if tasks were saved to localStorage
  });

  it('should update tasks in localStorage', () => {
    const task = { id: 1, assignedTo: 'User1', status: 'Completed', dueDate: '2024-01-01', priority: 'High', comment: 'Updated Task 1' };
    service.updateTask(task); // Update the task
    expect(localStorage.setItem).toHaveBeenCalled(); // Check if tasks were saved to localStorage
  });

  it('should delete tasks from localStorage', () => {
    service.deleteTask(1); // Delete the task
    expect(localStorage.setItem).toHaveBeenCalled(); // Check if tasks were saved to localStorage after deletion
  });
});
