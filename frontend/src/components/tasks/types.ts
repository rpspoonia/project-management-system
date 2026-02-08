import type { TaskStatus } from "./status";

export type Comment = {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  assigneeEmail?: string | null;
  dueDate?: string | null;
  createdAt: string;
  comments: Comment[];
};
