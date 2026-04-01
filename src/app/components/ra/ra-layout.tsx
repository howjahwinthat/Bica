import { Outlet, NavLink, useNavigate } from "react-router";
import {
  FileText,
  Edit3,
  Settings,
  Calendar,
  GraduationCap,
  Home,
  Menu,
  X,
  LogOut,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export function RALayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/ra/dashboard", label: "Dashboard", icon: Home },
    { path: "/ra/create-study", label: "Create Study", icon: FileText },
    { path: "/ra/edit-study", label: "Edit Study", icon: Edit3 },
    { path: "/ra/study-rules", label: "Study Rules", icon: Settings },
    { path: "/ra/session-management", label: "Session Management", icon: Calendar },
    { path: "/ra/training", label: "Training & Onboarding", icon: GraduationCap },
    { path: "/ra/participants", label: "My Participants", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-20 flex items-center justify-between">
        <h1 className="font-semibold">RA Portal</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-200 ease-in-out z-10
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:pt-0 pt-16 overflow-y-auto flex flex-col
        `}
      >
        <div className="p-6 border-b border-gray-200 hidden lg:block">
          <h1 className="text-xl font-bold text-gray-900">BICA RA Portal</h1>
          <p className="text-sm text-gray-500">Research Assistant</p>
        </div>

        <nav className="p-4 flex flex-col flex-1">
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

          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}