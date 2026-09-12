import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitProblemPage from "./pages/SubmitProblemPage";
import MyWorkspacePage from "./pages/MyWorkspacePage";
import ProblemDetailsPage from "./pages/ProblemDetailsPage";
import AdminProblemsPage from "./pages/AdminProblemsPage";
import AdminAIAnalysisPage from "./pages/AdminAIAnalysisPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center text-lagoon">
        Loading your workspace…
      </div>
    );
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submit-problem"
        element={
          <ProtectedRoute>
            <SubmitProblemPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <MyWorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/problems"
        element={
          <ProtectedRoute>
            <AdminProblemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ai-analysis"
        element={
          <ProtectedRoute>
            <AdminAIAnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problem/:id"
        element={
          <ProtectedRoute>
            <ProblemDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
