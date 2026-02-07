import { useQuery } from "@apollo/client/react";
import { GET_PROJECTS } from "./graphql/queries/projects";

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

const ORGANIZATION_SLUG = "rohit";

function App() {
  const { data, loading, error } = useQuery<
    GetProjectsData,
    GetProjectsVars
  >(GET_PROJECTS, {
    variables: { organizationSlug: ORGANIZATION_SLUG },
  });

  if (loading) return <div className="p-6">Loading projects...</div>;
  if (error) return <div className="p-6 text-red-500">{error.message}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      <div className="space-y-4">
        {data?.projects.map((project) => (
          <div
            key={project.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <div className="text-sm text-gray-600 mt-2">
              <p>Total Tasks: {project.taskCount}</p>
              <p>Completed: {project.completedTaskCount}</p>
              <p>Completion Rate: {project.completionRate}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
