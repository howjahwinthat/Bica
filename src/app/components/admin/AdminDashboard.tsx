import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FileText,
  Edit3,
  CheckCircle,
  Settings,
  Calendar,
  GraduationCap,
  Users,
  BookOpen,
  Clock,
  UserCheck,
} from "lucide-react";

type Stats = {
  totalStudies: number;
  pendingApprovals: number;
  totalStudents: number;
  totalRAs: number;
};

interface ModuleCard {
  title: string;
  description: string;
  buttonLabel: string;
  buttonColor: string;
  iconBg: string;
  iconColor: string;
  Icon: React.FC<{ size?: number; className?: string }>;
  to: string;
}

const modules: ModuleCard[] = [
  {
    title: "Create Study",
    description: "Set up a new research study with all required details",
    buttonLabel: "Create New Study",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    Icon: FileText,
    to: "/create-study",
  },
  {
    title: "Edit Studies",
    description: "View and edit existing studies",
    buttonLabel: "Edit Studies",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
    Icon: Edit3,
    to: "/edit-study",
  },
  {
    title: "Study Approval",
    description: "Review and approve pending study requests",
    buttonLabel: "Review Approvals",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
    Icon: CheckCircle,
    to: "/study-approval",
  },
  {
    title: "Study Rules",
    description: "Configure rules and eligibility criteria for studies",
    buttonLabel: "Manage Rules",
    buttonColor: "bg-red-500 hover:bg-red-600",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    Icon: Settings,
    to: "/study-rules",
  },
  {
    title: "Session Management",
    description: "Schedule and manage study sessions and timeslots",
    buttonLabel: "Manage Sessions",
    buttonColor: "bg-green-600 hover:bg-green-700",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    Icon: Calendar,
    to: "/session-management",
  },
  {
    title: "Training Portal",
    description: "Onboard researchers with training materials and guides",
    buttonLabel: "Open Training",
    buttonColor: "bg-indigo-500 hover:bg-indigo-600",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-500",
    Icon: GraduationCap,
    to: "/training",
  },
  {
    title: "User Management",
    description: "View and manage student and RA accounts",
    buttonLabel: "Manage Users",
    buttonColor: "bg-gray-600 hover:bg-gray-700",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
    Icon: Users,
    to: "/user-management",
  },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalStudies: 0,
    pendingApprovals: 0,
    totalStudents: 0,
    totalRAs: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3600/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load stats");
      }
    };
    fetchStats();
  }, []);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Study Management Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-base">
          Manage studies, approvals, and training workflows
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Studies</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{stats.totalStudies}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Approvals</span>
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-700">{stats.pendingApprovals}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Students</span>
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">{stats.totalStudents}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total RAs</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700">{stats.totalRAs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.Icon;
          return (
            <div
              key={mod.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${mod.iconBg}`}
              >
                <Icon size={28} className={mod.iconColor} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{mod.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                {mod.description}
              </p>
              <Link to={mod.to} className="w-full">
                <button
                  className={`w-full py-2.5 px-4 rounded-lg text-white text-sm font-semibold transition-colors duration-150 ${mod.buttonColor}`}
                >
                  {mod.buttonLabel}
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;