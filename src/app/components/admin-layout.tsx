import { Outlet, NavLink, useNavigate } from "react-router";
import {
  FileText,
  Edit3,
  CheckCircle,
  Settings,
  Calendar,
  GraduationCap,
  Home,
  Menu,
  X,
  LayoutDashboard,
  ClipboardCheck,
  Award,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/create-study", label: "Create Study", icon: FileText },
    { path: "/edit-study", label: "Edit Study", icon: Edit3 },
    { path: "/study-approval", label: "Study Approval", icon: CheckCircle },
    { path: "/study-rules", label: "Study Rules", icon: Settings },
    { path: "/session-management", label: "Session Management", icon: Calendar },
    { path: "/training", label: "Training & Onboarding", icon: GraduationCap },
  ];

  const attendanceAndCreditItems = [
    { path: "/attendance", label: "Mark Attendance", icon: ClipboardCheck },
    { path: "/credit-management", label: "Credit Management", icon: Award },
    { path: "/multi-study-tracking", label: "Multi-Study Tracking", icon: BarChart3 },
  ];

  const importedAdminItems = [
    { path: "/admin/dashboard", label: "Imported Admin Dashboard", icon: LayoutDashboard },
    { path: "/admin/timeslots", label: "Timeslot List", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-20 flex items-center justify-between">
        <h1 className="font-semibold">Study Management</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-200 ease-in-out z-10
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:pt-0 pt-16 overflow-y-auto
        `}
      >
        <div className="p-6 border-b border-gray-200 hidden lg:block">
          <h1 className="text-xl font-bold text-gray-900">BICA Admin</h1>
          <p className="text-sm text-gray-500">Study Management System</p>
        </div>

        <nav className="p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Main Modules</h3>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Attendance & Credits</h3>
            <ul className="space-y-1">
              {attendanceAndCreditItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-green-50 text-green-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Admin Tools</h3>
            <ul className="space-y-1">
              {importedAdminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-purple-50 text-purple-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
