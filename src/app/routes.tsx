import { createBrowserRouter } from "react-router";
import { Home } from "@/app/components/Home";
import { StudentSignup } from "@/app/components/student/StudentSignup";
import { StudentLogin } from "@/app/components/student/StudentLogin";
import { StudentDashboard } from "@/app/components/student/StudentDashboard";
import { StudyDetails } from "@/app/components/student/StudyDetails";
import { AdminLogin } from "@/app/components/admin/AdminLogin";
import { AdminDashboard } from "@/app/components/admin/AdminDashboard";
import { CreateEditStudy } from "@/app/components/admin/CreateEditStudy";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/student/signup",
    Component: StudentSignup,
  },
  {
    path: "/student/login",
    Component: StudentLogin,
  },
  {
    path: "/student/dashboard",
    Component: () => (
      <ProtectedRoute role="student">
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/study/:id",
    Component: () => (
      <ProtectedRoute role="student">
        <StudyDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: () => (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/study/new",
    Component: () => (
      <ProtectedRoute role="admin">
        <CreateEditStudy />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/study/:id/edit",
    Component: () => (
      <ProtectedRoute role="admin">
        <CreateEditStudy />
      </ProtectedRoute>
    ),
  },
]);
