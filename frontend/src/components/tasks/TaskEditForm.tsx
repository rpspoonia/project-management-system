import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_TASK } from "../../graphql/mutations/updateTask";
import type {
  UpdateTaskResult,
  UpdateTaskVars,
} from "../../graphql/mutations/updateTask";
import type { Task } from "./types";

type Props = {
  task: Task;
  onCancel: () => void;
};

export default function TaskEditForm({ task, onCancel }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description ?? ""
  );
  const [assigneeEmail, setAssigneeEmail] = useState(
    task.assigneeEmail ?? ""
  );

  const [updateTask, { loading, error }] = useMutation<
    UpdateTaskResult,
    UpdateTaskVars
  >(UPDATE_TASK, {
    optimisticResponse: {
      updateTask: {
        __typename: "UpdateTask",
        task: {
          __typename: "TaskType",
          id: task.id,
          title,
          description,
          assigneeEmail,
          status: task.status,
        },
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await updateTask({
      variables: {
        taskId: task.id,
        title,
        description: description || undefined,
        assigneeEmail: assigneeEmail || undefined,
      },
    });

    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">
          Edit task
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-[11px] text-slate-500">
          Title
        </label>
        <input
          className="
            w-full
            rounded-lg
            border
            px-3
            py-2
            text-sm
            focus:outline-none
            focus:ring-1
            focus:ring-slate-300
          "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-[11px] text-slate-500">
          Description
        </label>
        <textarea
          rows={3}
          className="
            w-full
            rounded-lg
            border
            px-3
            py-2
            text-xs
            focus:outline-none
            focus:ring-1
            focus:ring-slate-300
          "
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>

      {/* Assignee */}
      <div className="space-y-1">
        <label className="text-[11px] text-slate-500">
          Assignee
        </label>
        <input
          type="email"
          className="
            w-full
            rounded-lg
            border
            px-3
            py-2
            text-xs
            focus:outline-none
            focus:ring-1
            focus:ring-slate-300
          "
          value={assigneeEmail}
          onChange={(e) => setAssigneeEmail(e.target.value)}
          placeholder="Assignee email"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600">
          {error.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="
            rounded-lg
            bg-slate-900
            px-4
            py-2
            text-xs
            font-medium
            text-white
            transition
            hover:bg-slate-800
            disabled:opacity-50
          "
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
