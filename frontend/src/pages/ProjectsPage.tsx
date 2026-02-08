import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";
import { GET_PROJECTS } from "../graphql/queries/projects";
import OrganizationSwitcher from "../components/OrganizationSwitcher";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROJECT } from "../graphql/mutations/createProject";
import Modal from "../components/ui/Modal";
import { useState } from "react";

type Project = {
  id: string;
  name: string;
  taskCount: number;
  completedTaskCount: number;
  completionRate: number;
};

type GetProjectsData = {
  projects: Project[];
};

type GetProjectsVars = {
  organizationSlug: string;
};

type CreateProjectResult = {
  createProject: {
    project: {
      id: string;
      name: string;
    };
  };
};

type CreateProjectVars = {
  organizationSlug: string;
  name: string;
  description?: string;
  dueDate?: string;
};

export default function ProjectsPage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();

  const { data, loading, error } = useQuery<
    GetProjectsData,
    GetProjectsVars
  >(GET_PROJECTS, {
    variables: { organizationSlug: orgSlug ?? "" },
    skip: !orgSlug,
  });

  const [showCreate, setShowCreate] = useState(false);

  const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [dueDate, setDueDate] = useState("");

const [createProject, { loading: creating }] =
  useMutation<CreateProjectResult, CreateProjectVars>(
    CREATE_PROJECT,
    {
      onCompleted: () => {
        setShowCreate(false);
        setName("");
        setDescription("");
        setDueDate("");
      },
      refetchQueries: orgSlug
        ? [
            {
              query: GET_PROJECTS,
              variables: { organizationSlug: orgSlug },
            },
          ]
        : [],
    }
  );
  
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">
            Projects
          </h1>
          <p className="text-xs text-slate-500">
            Organization: {orgSlug}
          </p>
        </div>

      <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            + New Project
          </button>

          <OrganizationSwitcher />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">
          {error.message}
        </p>
      ) : data?.projects.length === 0 ? (
        <p className="text-sm text-slate-500">
          No projects found.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data?.projects.map((project) => (
            <Link
              key={project.id}
              to={`/org/${orgSlug}/projects/${project.id}`}
              className="
                group
                rounded-xl
                bg-white
                p-4
                shadow-sm
                transition
                hover:shadow-md
              "
            >
              <h2 className="text-sm font-medium text-slate-800 group-hover:underline">
                {project.name}
              </h2>

              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>Total tasks: {project.taskCount}</p>
                <p>Completed: {project.completedTaskCount}</p>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-green-500 transition-all"
                    style={{
                      width: `${project.completionRate}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {project.completionRate}% complete
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      {showCreate && (
        <Modal
          title="Create project"
          onClose={() => setShowCreate(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || !orgSlug) return;

              createProject({
                variables: {
                  organizationSlug: orgSlug,
                  name,
                  description: description || undefined,
                  dueDate: dueDate || undefined,
                },
              });
            }}
            className="space-y-3"
          >
            <input
              autoFocus
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <textarea
              className="w-full rounded-lg border px-3 py-2 text-xs"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2 text-xs"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button
              disabled={creating}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs text-white disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create project"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
