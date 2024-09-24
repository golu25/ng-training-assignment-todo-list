import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  imports: [ReactiveFormsModule],
})
export class TaskFormComponent {
  @Input() task: any = null; 
  @Output() saveTask = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();

  taskForm = this.fb.group({
    assignedTo: [''],
    status: ['Completed'],
    dueDate: [''],
    priority: ['Low'],
    comment: [''],
  });

  statuses = ['Completed', 'In Progress', 'Not Started'];
  priorities = ['Low', 'Normal', 'High'];

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.taskForm.valid) {
      this.saveTask.emit(this.taskForm.value);
      this.closeForm.emit();
    }
  }

  onClose() {
    this.closeForm.emit();
  }
}
