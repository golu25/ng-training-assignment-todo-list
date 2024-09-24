import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TaskFormComponent], // Add TaskFormComponent to imports
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initialize the component
  });

  it('should emit saveTask event when form is valid and submitted', () => {
    // Set valid form values
    component.taskForm.controls['assignedTo'].setValue('User1'); // Set valid assignedTo
    component.taskForm.controls['dueDate'].setValue('2024-01-01'); // Set valid dueDate
    component.taskForm.controls['comment'].setValue('Task comment'); // Set valid comment

    // Spy on the output event emitters
    spyOn(component.saveTask, 'emit');
    spyOn(component.closeForm, 'emit');

    // Submit the form
    component.onSubmit();

    // Check that saveTask was emitted
    expect(component.saveTask.emit).toHaveBeenCalledWith({
      assignedTo: 'User1',
      dueDate: '2024-01-01',
      comment: 'Task comment',
      status: 'Completed', // Default value
      priority: 'Low', // Default value
    });
    expect(component.closeForm.emit).toHaveBeenCalled(); // Check if closeForm was emitted
  });

  it('should emit closeForm event when onClose is called', () => {
    spyOn(component.closeForm, 'emit'); // Spy on closeForm emitter

    // Call the method
    component.onClose();

    // Expect closeForm to be emitted
    expect(component.closeForm.emit).toHaveBeenCalled();
  });

  it('should not emit saveTask or closeForm when form is invalid and submitted', () => {
    // Set invalid form values
    component.taskForm.controls['assignedTo'].setValue(''); // Invalid: empty assignedTo

    // Spies on the output event emitters
    spyOn(component.saveTask, 'emit');
    spyOn(component.closeForm, 'emit');

    // Submit the form
    component.onSubmit();

    // Check that no events were emitted
    expect(component.saveTask.emit).not.toHaveBeenCalled();
    expect(component.closeForm.emit).not.toHaveBeenCalled();
  });
});
