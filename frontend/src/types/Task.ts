import { User } from "./User";

export interface Task {
  id?: number;
  plannedDescription: string;
  executedDescription?: string;
  creationDate?: string;
  dueDate: string;
  executionStatus?: string;
  taskSituation?: string;
  responsible: User;
}
