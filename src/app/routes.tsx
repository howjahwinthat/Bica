import { createBrowserRouter } from "react-router-dom";
import Home from "@/app/components/Home";
import StudentSignup from "@/app/components/student/StudentSignup";
import StudentLogin from "@/app/components/student/StudentLogin";
import StudentDashboard from "@/app/components/student/StudentDashboard";
import StudyDetails from "@/app/components/student/StudyDetails";
import AdminLogin from "@/app/components/admin/AdminLogin";
import AdminDashboard from "@/app/components/admin/AdminDashboard";
import CreateEditStudy from "@/app/components/admin/CreateEditStudy";
import CreateTimeslot from "@/app/components/admin/CreateTimeslot";
import TimeslotList from "@/app/components/admin/TimeslotList";
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: "/",
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
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/timeslots",
    element: (
      <ProtectedRoute role="admin">
        <TimeslotList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/study/new",
    element: (
      <ProtectedRoute role="admin">
        <CreateEditStudy />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/study/:id/edit",
    element: (
      <ProtectedRoute role="admin">
        <CreateEditStudy />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/timeslot/new",
    element: (
      <ProtectedRoute role="admin">
        <CreateTimeslot />
      </ProtectedRoute>
    ),
  },
]);
