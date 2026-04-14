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
import { UserManagement } from "@/app/components/pages/user-management";
import { AdminCalendar } from "@/app/components/pages/calendar";
import TimeslotList from "@/app/components/admin/TimeslotList";
import AdminLogin from "@/app/components/admin/AdminLogin";

// RA components
import { RALogin } from "@/app/components/ra/ra-login";
import { RASignup } from "@/app/components/ra/ra-signup";
import { RADashboard } from "@/app/components/ra/ra-dashboard";
import { RAParticipants } from "@/app/components/ra/ra-participants";

// Student components
import Home from "@/app/components/Home";
import StudentSignup from "@/app/components/student/StudentSignup";
import StudentLogin from "@/app/components/student/StudentLogin";
import StudentDashboard from "@/app/components/student/StudentDashboard";
import StudyDetails from "@/app/components/student/StudyDetails";
import StudentCalendar from "@/app/components/student/StudentCalendar";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },

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
      { path: "/admin/timeslots", Component: TimeslotList },
      { path: "/calendar", Component: AdminCalendar },
      { path: "/user-management", Component: UserManagement },
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
      { path: "/ra/participants", Component: RAParticipants },
    ],
  },

  // Auth routes
  { path: "/admin/login", Component: AdminLogin },
  { path: "/ra/login", Component: RALogin },
  { path: "/ra/signup", Component: RASignup },

  // Student routes
  { path: "/student/signup", element: <StudentSignup /> },
  { path: "/student/login", element: <StudentLogin /> },
  { path: "/student/calendar", element: <ProtectedRoute role="student"><StudentCalendar /></ProtectedRoute> },
  {
    path: "/student/dashboard",
    element: <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>,
  },
  {
    path: "/student/study/:id",
    element: <ProtectedRoute role="student"><StudyDetails /></ProtectedRoute>,
  },

  { path: "*", element: <div className="p-6">Page not found</div> },
]);