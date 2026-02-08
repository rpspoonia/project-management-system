import { useMutation } from "@apollo/client/react";
import { UPDATE_TASK } from "../../graphql/mutations/updateTask";
import { ADD_TASK_COMMENT } from "../../graphql/mutations/addTaskComment";
import type { Task } from "./types";
import TaskStatusDropdown from "./TaskStatusDropdown";

type Props = {
  task: Task;
  onEdit: () => void;
};

export default function TaskView({ task, onEdit }: Props) {
  const [updateTask] = useMutation(UPDATE_TASK);
  const [addTaskComment] = useMutation(ADD_TASK_COMMENT);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-slate-800">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Status pill (temporary cycle behavior) */}
          <TaskStatusDropdown
            value={task.status}
            onChange={(status) =>
                updateTask({
                variables: {
                    taskId: task.id,
                    status,
                },
                })
            }
            />

          <button
            onClick={onEdit}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
        {task.assigneeEmail && (
          <span>Assignee: {task.assigneeEmail}</span>
        )}
        {task.dueDate && <span>Due: {task.dueDate}</span>}
        <span>
          Created{" "}
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Comments */}
      <div className="mt-4 space-y-3">
        <h4 className="text-xs font-medium text-slate-600">
          Comments
        </h4>

        {task.comments.length === 0 ? (
          <p className="text-xs text-slate-400">
            No comments yet.
          </p>
        ) : (
          task.comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg bg-slate-50 p-2 text-xs"
            >
              <p className="text-slate-700">
                {comment.content}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {comment.authorEmail} ·{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}

        {/* Add comment */}
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem(
              "content"
            ) as HTMLInputElement;

            if (!input.value) return;

            addTaskComment({
              variables: {
                taskId: task.id,
                content: input.value,
                authorEmail: "demo@user.com",
              },
            });

            input.value = "";
          }}
        >
          <input
            name="content"
            placeholder="Add a comment..."
            className="
              flex-1
              rounded-lg
              border
              px-3
              py-1.5
              text-xs
              focus:outline-none
              focus:ring-1
              focus:ring-slate-300
            "
          />
          <button
            type="submit"
            className="text-xs text-blue-600 hover:underline"
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
}
