import { Outlet, NavLink, useNavigate } from "react-router";
import {
  FileText, Edit3, CheckCircle, Settings, Calendar,
  GraduationCap, Home, Menu, X, LogOut, Users, ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/create-study", label: "Create Study", icon: FileText },
    { path: "/edit-study", label: "Edit Studies", icon: Edit3 },
    { path: "/study-approval", label: "Study Approval", icon: CheckCircle },
    { path: "/study-rules", label: "Study Rules", icon: Settings },
    { path: "/session-management", label: "Session Management", icon: ClipboardList },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/admin/timeslots", label: "Timeslot List", icon: Calendar },
    { path: "/user-management", label: "User Management", icon: Users },
    { path: "/training", label: "Training Portal", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 shadow-md"
        style={{ backgroundColor: '#003580' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(192,192,192,0.3)' }}>
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="text-white font-bold">BICA+</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-1">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-10 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 pt-16 lg:pt-0 overflow-y-auto
      `} style={{ backgroundColor: '#003580' }}>

        {/* Logo */}
        <div className="p-6 hidden lg:block" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(192,192,192,0.2)' }}>
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg">BICA+</p>
              <p className="text-blue-200 text-xs">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 py-3 mx-3 mt-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
            <p className="text-blue-200 text-xs capitalize">{user.role}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-blue-200 hover:text-white hover:bg-white/10"
                  }`
                }
                style={({ isActive }) => isActive ? { backgroundColor: 'rgba(255,255,255,0.2)' } : {}}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/20"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}