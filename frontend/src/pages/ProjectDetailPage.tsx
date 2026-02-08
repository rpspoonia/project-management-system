import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_TASKS } from "../graphql/queries/tasks";
import { CREATE_TASK } from "../graphql/mutations/createTask";
import TaskItem from "../components/tasks/TaskItem";
import type { Task as UITask } from "../components/tasks/types";
import { isTaskStatus } from "../components/tasks/status";
import { useState } from "react";

type Comment = {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  assigneeEmail?: string | null;
  dueDate?: string | null;
  createdAt: string;
  comments: Comment[];
};

type GetTasksData = {
  tasks: Task[];
};

type GetTasksVars = {
  projectId: string;
};

type CreateTaskVars = {
  projectId: string;
  title: string;
  description?: string;
  assigneeEmail?: string;
  dueDate?: string;
};

export default function ProjectDetailPage() {
  const { orgSlug, projectId } = useParams<{
    orgSlug: string;
    projectId: string;
  }>();

  const { data, loading, error, refetch } = useQuery<
    GetTasksData,
    GetTasksVars
  >(GET_TASKS, {
    variables: { projectId: projectId ?? "" },
    skip: !projectId,
  });

  const [createTask, { loading: creating }] = useMutation<
    any,
    CreateTaskVars
  >(CREATE_TASK, {
    onCompleted: () => {
      setTitle("");
      setDescription("");
      setAssigneeEmail("");
      setDueDate("");
      refetch();
    },
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [dueDate, setDueDate] = useState("");

  const uiTasks: UITask[] =
    data?.tasks.map((task) => ({
      ...task,
      status: isTaskStatus(task.status)
        ? task.status
        : "TODO",
    })) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Back */}
      <Link
        to={`/org/${orgSlug}/projects`}
        className="text-xs text-slate-500 hover:text-slate-700"
      >
        ← Back to Projects
      </Link>

      {/* Header */}
      <div className="mt-4 mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">
          Tasks
        </h1>
      </div>

      {/* Create Task */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-medium text-slate-700">
          Create task
        </h2>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!projectId || !title) return;

            createTask({
              variables: {
                projectId,
                title,
                description: description || undefined,
                assigneeEmail: assigneeEmail || undefined,
                dueDate: dueDate || undefined,
              },
            });
          }}
        >
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full rounded-lg border px-3 py-2 text-xs"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border px-3 py-2 text-xs"
              placeholder="Assignee email"
              value={assigneeEmail}
              onChange={(e) =>
                setAssigneeEmail(e.target.value)
              }
            />

            <input
              type="date"
              className="rounded-lg border px-3 py-2 text-xs"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="
              rounded-lg
              bg-slate-900
              px-4
              py-2
              text-xs
              font-medium
              text-white
              hover:bg-slate-800
              disabled:opacity-50
            "
          >
            {creating ? "Creating…" : "Add task"}
          </button>
        </form>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-20 rounded-xl bg-slate-100" />
          <div className="h-20 rounded-xl bg-slate-100" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">
          {error.message}
        </p>
      ) : uiTasks.length === 0 ? (
        <p className="text-sm text-slate-500">
          No tasks yet.
        </p>
      ) : (
        <div className="space-y-4">
          {uiTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
