// src/app/task.model.ts
export interface Task {
    id: number;
    assignedTo: string;
    status: string;
    dueDate: string;
    priority: string;
    comment: string;
  }
  