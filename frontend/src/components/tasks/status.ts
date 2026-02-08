export const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
] as const;

export type TaskStatus = typeof TASK_STATUSES[number];

/**
 * Human-readable labels for UI
 */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

/**
 * Tailwind styles for status pills
 */
export const TASK_STATUS_STYLES: Record<TaskStatus, string> = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100 text-green-700",
};

/**
 * Type guard for GraphQL data safety
 */
export const isTaskStatus = (
  value: string
): value is TaskStatus => {
  return (TASK_STATUSES as readonly string[]).includes(value);
};

/**
 * Status progression (used by cycle & dropdown)
 */
export const nextStatus = (status: TaskStatus): TaskStatus => {
  const currentIndex = TASK_STATUSES.indexOf(status);
  const nextIndex =
    (currentIndex + 1) % TASK_STATUSES.length;
  return TASK_STATUSES[nextIndex];
};
