import Home from "./components/Home";
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

// RoleRedirect: reads the current user's role and sends them to the right home page.
// Replace the role-detection logic here with however your app stores auth state
// (e.g. context, Redux, a cookie, localStorage, etc.).
function RoleRedirect() {
  const role = getCurrentUserRole(); // 👈 replace with your actual auth hook/util
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "student") return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/student/login" replace />; // unauthenticated fallback
}

export const router = createBrowserRouter([
  // ─── Root: role-based redirect ───────────────────────────────────────────
  {
    path: "/",
    element: <RoleRedirect />,
  },

  // ─── Legacy admin routes (AdminLayout wrapper) ────────────────────────────
  {
    path: "/dashboard",
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "create-study", Component: CreateStudy },
      { path: "edit-study/:studyId?", Component: EditStudy },
      { path: "study-approval", Component: StudyApproval },
      { path: "study-rules/:studyId?", Component: StudyRules },
      { path: "session-management", Component: SessionManagement },
      { path: "training", Component: TrainingOnboarding },
    ],
  },

  // ─── Admin routes (no shared layout) ─────────────────────────────────────
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/admin/study/new",
    Component: CreateEditStudy,
  },
  {
    path: "/admin/study/:id",
    Component: CreateEditStudy,
  },
  {
    path: "/admin/timeslot/new",
    Component: CreateTimeslot,
  },
  {
    path: "/admin/timeslot/:id",
    Component: EditTimeslot,
  },
  {
    path: "/admin/timeslots",
    Component: TimeslotList,
  },

  // ─── Student / public routes (no shared layout) ───────────────────────────
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
