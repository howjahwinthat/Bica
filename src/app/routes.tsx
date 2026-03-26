import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "./components/admin-layout";

// Pages
import { Dashboard } from "./components/pages/dashboard";
import { CreateStudy } from "./components/pages/create-study";
import { EditStudy } from "./components/pages/edit-study";
import { StudyApproval } from "./components/pages/study-approval";
import { StudyRules } from "./components/pages/study-rules";
import { SessionManagement } from "./components/pages/session-management";
import { TrainingOnboarding } from "./components/pages/training-onboarding";
import { Attendance } from "./components/pages/attendance";
import { CreditManagement } from "./components/pages/credit-management";
import { MultiStudyTracking } from "./components/pages/multi-study-tracking";

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
      { path: "edit-stud
