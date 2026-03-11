import { createBrowserRouter, Navigate } from "react-router";
import { AdminLayout } from "./components/admin-layout";
import { Dashboard } from "./components/pages/dashboard";
import { CreateStudy } from "./components/pages/create-study";
import { EditStudy } from "./components/pages/edit-study";
import { StudyApproval } from "./components/pages/study-approval";
import { StudyRules } from "./components/pages/study-rules";
import { SessionManagement } from "./components/pages/session-management";
import { TrainingOnboarding } from "./components/pages/training-onboarding";
import AdminDashboard from "./components/admin/AdminDashboard";
import CreateEditStudy from "./components/admin/CreateEditStudy";
import CreateTimeslot from "./components/admin/CreateTimeslot";
import EditTimeslot from "./components/admin/EditTimeslot";
import TimeslotList from "./components/admin/TimeslotList";
import AdminLogin from "./components/admin/AdminLogin";
import Home from "./components/Home";
import StudentSignup from "./components/student/StudentSignup";
import StudentLogin from "./components/student/StudentLogin";
import StudentDashboard from "./components/student/StudentDashboard";
import StudyDetails from "./components/student/StudyDetails";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function RoleRedirect() {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "student") return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/student/login" replace />;
}

export const router = createBrowserRouter([
  // ─── Root: role-based redirect ────────────────────────────────────────────
  {
    path: "/",
    element: <RoleRedirect />,
  },

  // ─── All routes with sidebar (AdminLayout) ────────────────────────────────
  {
    Component: AdminLayout,
    children: [
      // Legacy dashboard routes
      { path: "/dashboard", Component: Dashboard },
      { path: "/create-study", Component: CreateStudy },
      { path: "/edit-study/:studyId?", Component: EditStudy },
      { path: "/study-approval", Component: StudyApproval },
      { path: "/study-rules/:studyId?", Component: StudyRules },
      { path: "/session-management", Component: SessionManagement },
      { path: "/training", Component: TrainingOnboarding },

      // Admin routes — now inside AdminLayout so sidebar shows
      { path: "/admin/dashboard", Component: AdminDashboard },
      { path: "/admin/study/new", Component: CreateEditStudy },
      { path: "/admin/study/:id", Component: CreateEditStudy },
      { path: "/admin/timeslot/new", Component: CreateTimeslot },
      { path: "/admin/timeslot/:id", Component: EditTimeslot },
      { path: "/admin/timeslots", Component: TimeslotList },
    ],
  },

  // ─── Auth / public routes (no sidebar) ───────────────────────────────────
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/student/signup",
    element: <StudentSignup />,
  },
  {
    path: "/student/login",
    element: <StudentLogin />,
  },
  {
    path: "/student/dashboard",
    element: (
      <ProtectedRoute role="student">
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/study/:id",
    element: (
      <ProtectedRoute role="student">
        <StudyDetails />
      </ProtectedRoute>
    ),
  },
]);
