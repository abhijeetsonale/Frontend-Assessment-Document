export interface Task {
  id: number;
  title: string;
  assignedTo: string;
  status: string;
  dueDate: Date;
  priority: string;
  comments: string;
  completed: boolean;
}
