import { Link } from "react-router";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import {
  FileText, Edit3, CheckCircle, Settings,
  Calendar, GraduationCap, Users, BarChart3,
  ClipboardList, BookOpen
} from "lucide-react";

interface Stats {
  totalStudies: number;
  pendingApprovals: number;
  totalStudents: number;
  totalRAs: number;
}

const modules = [
  {
    title: "Create Study",
    description: "Set up a new research study with all required details and time slots",
    buttonLabel: "Create New Study",
    icon: FileText,
    to: "/create-study",
    color: "#003580",
    lightColor: "#EBF0FA",
  },
  {
    title: "Edit Studies",
    description: "View, modify, or delete existing research studies",
    buttonLabel: "Edit Studies",
    icon: Edit3,
    to: "/edit-study",
    color: "#0047AB",
    lightColor: "#EBF0FA",
  },
  {
    title: "Study Approval",
    description: "Review and approve pending study submissions from researchers",
    buttonLabel: "Review Approvals",
    icon: CheckCircle,
    to: "/study-approval",
    color: "#1565C0",
    lightColor: "#EBF0FA",
  },
  {
    title: "Study Rules",
    description: "Configure eligibility rules and requirements for studies",
    buttonLabel: "Manage Rules",
    icon: Settings,
    to: "/study-rules",
    color: "#003580",
    lightColor: "#EBF0FA",
  },
  {
    title: "Session Management",
    description: "Schedule and manage study sessions and participant timeslots",
    buttonLabel: "Manage Sessions",
    icon: ClipboardList,
    to: "/session-management",
    color: "#0047AB",
    lightColor: "#EBF0FA",
  },
  {
    title: "Calendar",
    description: "View all study sessions and timeslots on a monthly calendar",
    buttonLabel: "Open Calendar",
    icon: Calendar,
    to: "/calendar",
    color: "#1565C0",
    lightColor: "#EBF0FA",
  },
  {
    title: "User Management",
    description: "Manage student and researcher accounts and permissions",
    buttonLabel: "Manage Users",
    icon: Users,
    to: "/user-management",
    color: "#003580",
    lightColor: "#EBF0FA",
  },
  {
    title: "Training Portal",
    description: "Onboard researchers with training materials and quizzes",
    buttonLabel: "Open Training",
    icon: GraduationCap,
    to: "/training",
    color: "#0047AB",
    lightColor: "#EBF0FA",
  },
];

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("http://localhost:3600/api/stats")
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(192,192,192,0.3)' }}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Study Management Dashboard</h1>
              <p className="text-blue-200 text-sm">BICA+ Research Administration Portal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-4 gap-5 mb-10 -mt-6">
            <Card className="p-5 border-0 shadow-md bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total Studies</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: '#003580' }}>{stats.totalStudies}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                  <BookOpen className="w-6 h-6" style={{ color: '#003580' }} />
                </div>
              </div>
            </Card>
            <Card className="p-5 border-0 shadow-md bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Pending Approvals</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: stats.pendingApprovals > 0 ? '#D97706' : '#003580' }}>
                    {stats.pendingApprovals}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: stats.pendingApprovals > 0 ? '#FEF3C7' : '#EBF0FA' }}>
                  <CheckCircle className="w-6 h-6" style={{ color: stats.pendingApprovals > 0 ? '#D97706' : '#003580' }} />
                </div>
              </div>
              {stats.pendingApprovals > 0 && (
                <Link to="/study-approval" className="text-xs font-medium mt-2 block" style={{ color: '#D97706' }}>
                  Review now →
                </Link>
              )}
            </Card>
            <Card className="p-5 border-0 shadow-md bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total Students</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: '#003580' }}>{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                  <Users className="w-6 h-6" style={{ color: '#003580' }} />
                </div>
              </div>
            </Card>
            <Card className="p-5 border-0 shadow-md bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Researchers</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: '#003580' }}>{stats.totalRAs}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                  <GraduationCap className="w-6 h-6" style={{ color: '#003580' }} />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Module Cards */}
        <h2 className="text-lg font-bold mb-4" style={{ color: '#003580' }}>Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Card key={mod.title} className="p-5 border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white flex flex-col">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: mod.lightColor }}>
                  <Icon className="w-5 h-5" style={{ color: mod.color }} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{mod.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">{mod.description}</p>
                <Link to={mod.to}>
                  <button
                    className="w-full py-2 px-4 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: mod.color }}
                  >
                    {mod.buttonLabel}
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