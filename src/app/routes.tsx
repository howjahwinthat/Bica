import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "./components/admin-layout";

// Pages (from file 2 path convention)
import { Dashboard } from "./pages/dashboard";
import { CreateStudy } from "./pages/create-study";
import { EditStudy } from "./pages/edit-study";
import { StudyApproval } from "./pages/study-approval";
import { StudyRules } from "./pages/study-rules";
import { SessionManagement } from "./pages/session-management";
import { TrainingOnboarding } from "./pages/training-onboarding";
import { Attendance } from "./pages/attendance";
import { CreditManagement } from "./pages/credit-management";
import { MultiStudyTracking } from "./pages/multi-study-tracking";

// Admin components
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin";
import CreateEditStudy from "./components/admin/CreateEditStudy";
import CreateTimeslot from "./components/admin/CreateTimeslot";
import EditTimeslot from "./components/admin/EditTimeslot";
import TimeslotList from "./components/admin/TimeslotList";

// Student components
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
      { path: "attendance", Component: Attendance },
      { path: "credit-management", Component: CreditManagement },
      { path: "multi-study-tracking", Component: MultiStudyTracking },
    ],
  },
  // Admin tools routes
  { path: "/admin/login", Component: AdminLogin },
  { path: "/admin/dashboard", Component: AdminDashboard },
  { path: "/admin/study/new", Component: CreateEditStudy },
  { path: "/admin/study/:id", Component: CreateEditStudy },
  { path: "/admin/timeslot/new", Component: CreateTimeslot },
  { path: "/admin/timeslot/:id", Component: EditTimeslot },
  { path: "/admin/timeslots", Component: TimeslotList },
  // Student routes
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
