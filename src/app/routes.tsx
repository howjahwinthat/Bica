import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "@/app/components/admin-layout";
import { RALayout } from "@/app/components/ra/ra-layout";

// Pages
import { Dashboard } from "@/app/components/pages/dashboard";
import { CreateStudy } from "@/app/components/pages/create-study";
import { EditStudy } from "@/app/components/pages/edit-study";
import { StudyApproval } from "@/app/components/pages/study-approval";
import { StudyRules } from "@/app/components/pages/study-rules";
import { SessionManagement } from "@/app/components/pages/session-management";
import { TrainingOnboarding } from "@/app/components/pages/training-onboarding";
import { Attendance } from "@/app/components/pages/attendance";
import { CreditManagement } from "@/app/components/pages/credit-management";
import { MultiStudyTracking } from "@/app/components/pages/multi-study-tracking";

// Admin components
import AdminDashboard from "@/app/components/admin/AdminDashboard";
import AdminLogin from "@/app/components/admin/AdminLogin";
import CreateEditStudy from "@/app/components/admin/CreateEditStudy";
import CreateTimeslot from "@/app/components/admin/CreateTimeslot";
import EditTimeslot from "@/app/components/admin/EditTimeslot";
import TimeslotList from "@/app/components/admin/TimeslotList";
import { AdminCalendar } from "@/app/components/pages/calendar";

// RA components
import { RALogin } from "@/app/components/ra/ra-login";
import { RASignup } from "@/app/components/ra/ra-signup";
import { RADashboard } from "@/app/components/ra/ra-dashboard";

// Student components
import Home from "@/app/components/Home";
import StudentSignup from "@/app/components/student/StudentSignup";
import StudentLogin from "@/app/components/student/StudentLogin";
import StudentDashboard from "@/app/components/student/StudentDashboard";
import StudyDetails from "@/app/components/student/StudyDetails";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import StudentCalendar from "@/app/components/student/StudentCalendar";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  // Admin routes
  {
    Component: AdminLayout,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/create-study", Component: CreateStudy },
      { path: "/edit-study/:studyId?", Component: EditStudy },
      { path: "/study-approval", Component: StudyApproval },
      { path: "/study-rules/:studyId?", Component: StudyRules },
      { path: "/session-management", Component: SessionManagement },
      { path: "/training", Component: TrainingOnboarding },
      { path: "/attendance", Component: Attendance },
      { path: "/credit-management", Component: CreditManagement },
      { path: "/multi-study-tracking", Component: MultiStudyTracking },
      { path: "/admin/dashboard", Component: AdminDashboard },
      { path: "/admin/timeslots", Component: TimeslotList },
      { path: "/calendar", Component: AdminCalendar },
    ],
  },
  // RA routes
  {
    Component: RALayout,
    children: [
      { path: "/ra/dashboard", Component: RADashboard },
      { path: "/ra/create-study", Component: CreateStudy },
      { path: "/ra/edit-study/:studyId?", Component: EditStudy },
      { path: "/ra/study-rules/:studyId?", Component: StudyRules },
      { path: "/ra/session-management", Component: SessionManagement },
      { path: "/ra/training", Component: TrainingOnboarding },
    ],
  },
  // Admin tools routes (outside layout)
  { path: "/admin/login", Component: AdminLogin },
  { path: "/admin/study/new", Component: CreateEditStudy },
  { path: "/admin/study/:id", Component: CreateEditStudy },
  { path: "/admin/timeslot/new", Component: CreateTimeslot },
  { path: "/admin/timeslot/:id", Component: EditTimeslot },
  // RA auth routes
  { path: "/ra/login", Component: RALogin },
  { path: "/ra/signup", Component: RASignup },
  // Student routes
  { path: "/student/signup", element: <StudentSignup /> },
  { path: "/student/calendar", element: <ProtectedRoute role="student"><StudentCalendar /></ProtectedRoute> },
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