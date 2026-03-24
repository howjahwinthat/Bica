import { createBrowserRouter } from "react-router-dom";

import { AdminLayout } from "./components/admin-layout";
import { Dashboard } from "./components/pages/dashboard";
import { CreateStudy } from "./components/pages/create-study";
import { EditStudy } from "./components/pages/edit-study";
import { StudyApproval } from "./components/pages/study-approval";
import { StudyRules } from "./components/pages/study-rules";
import { SessionManagement } from "./components/pages/session-management";
import { TrainingOnboarding } from "./components/pages/training-onboarding";

import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin";

import Home from "./components/Home";
import StudentSignup from "./components/student/StudentSignup";
import StudentLogin from "./components/student/StudentLogin";
import StudentDashboard from "./components/student/StudentDashboard";
import StudyDetails from "./components/student/StudyDetails";

import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    Component: AdminLayout,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/create-study", Component: CreateStudy },
      { path: "/edit-study", Component: EditStudy },
      { path: "/edit-study/:studyId", Component: EditStudy },
      { path: "/study-approval", Component: StudyApproval },
      { path: "/study-rules/:studyId", Component: StudyRules },
      { path: "/session-management", Component: SessionManagement },
      { path: "/training", Component: TrainingOnboarding },
      { path: "/admin/dashboard", Component: AdminDashboard },
    ],
  },

  { path: "/admin/login", Component: AdminLogin },

  { path: "/student/signup", element: <StudentSignup /> },
  { path: "/student/login", element: <StudentLogin /> },

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

  {
    path: "*",
    element: <div className="p-6">Page not found</div>,
  },
]);