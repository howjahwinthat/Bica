import { Link } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { FileText, Edit3, Settings, Calendar, GraduationCap, Users, LogOut, FlaskConical } from "lucide-react";
import { Card } from "../ui/card";

const modules = [
  { title: "Create Study", description: "Set up a new research study with all required details and time slots", to: "/ra/create-study", icon: FileText, color: '#003580' },
  { title: "Edit Studies", description: "View, modify, or delete your existing research studies", to: "/ra/edit-study", icon: Edit3, color: '#0047AB' },
  { title: "Study Rules", description: "Configure eligibility rules and requirements for your studies", to: "/ra/study-rules", icon: Settings, color: '#1565C0' },
  { title: "Session Management", description: "Open or close study sessions for participant registration", to: "/ra/session-management", icon: Calendar, color: '#003580' },
  { title: "Training Portal", description: "Complete required training modules and onboarding workflows", to: "/ra/training", icon: GraduationCap, color: '#0047AB' },
  { title: "My Participants", description: "View students registered for your research studies", to: "/ra/participants", icon: Users, color: '#1565C0' },
];

export function RADashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>

      {/* Header */}
      <header style={{ backgroundColor: '#003580' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(192,192,192,0.3)' }}>
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl">BICA+</span>
              <p className="text-blue-200 text-xs">Researcher Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <FlaskConical className="w-4 h-4 text-blue-200" />
              <span className="text-white text-sm font-medium">{user?.name}</span>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-blue-200">Manage your research studies and participants below.</p>
        </div>
      </div>

      {/* Module Cards */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-lg font-bold mb-4" style={{ color: '#003580' }}>Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map(mod => {
            const Icon = mod.icon;
            return (
              <Card key={mod.title} className="p-5 border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white flex flex-col">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#EBF0FA' }}>
                  <Icon className="w-5 h-5" style={{ color: mod.color }} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{mod.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">{mod.description}</p>
                <Link to={mod.to}>
                  <button className="w-full py-2 px-4 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: mod.color }}>
                    {mod.title}
                  </button>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}