import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/org/rohit/projects" replace />}
          />

          <Route
            path="/org/:orgSlug/projects"
            element={<ProjectsPage />}
          />

          <Route
            path="/org/:orgSlug/projects/:projectId"
            element={<ProjectDetailPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
