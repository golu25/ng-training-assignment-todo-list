import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TaskFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit and renders template
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const taskForm = component.taskForm;
    expect(taskForm).toBeTruthy();
    expect(taskForm.get('assignedTo')?.value).toBe('');
    expect(taskForm.get('status')?.value).toBe('Completed');
    expect(taskForm.get('dueDate')?.value).toBe('');
    expect(taskForm.get('priority')?.value).toBe('Low');
    expect(taskForm.get('comment')?.value).toBe('');
  });

  it('should emit saveTask with form values on submit', () => {
    spyOn(component.saveTask, 'emit');
    spyOn(component.closeForm, 'emit');

    // Set form values
    component.taskForm.setValue({
      assignedTo: 'John Doe',
      status: 'In Progress',
      dueDate: '2023-09-30',
      priority: 'High',
      comment: 'Urgent task',
    });

    // Call onSubmit
    component.onSubmit();

    expect(component.saveTask.emit).toHaveBeenCalledWith({
      assignedTo: 'John Doe',
      status: 'In Progress',
      dueDate: '2023-09-30',
      priority: 'High',
      comment: 'Urgent task',
    });

    expect(component.closeForm.emit).toHaveBeenCalled();
  });

  it('should not emit saveTask if form is invalid', () => {
    spyOn(component.saveTask, 'emit');
    spyOn(component.closeForm, 'emit');

    // Set invalid form values
    component.taskForm.setValue({
      assignedTo: '', // Invalid: required field
      status: 'In Progress',
      dueDate: '2023-09-30',
      priority: 'High',
      comment: 'Urgent task',
    });

    // Call onSubmit
    component.onSubmit();

    expect(component.saveTask.emit).not.toHaveBeenCalled();
    expect(component.closeForm.emit).not.toHaveBeenCalled();
  });

  it('should emit closeForm when onClose is called', () => {
    spyOn(component.closeForm, 'emit');

    component.onClose();

    expect(component.closeForm.emit).toHaveBeenCalled();
  });
});
