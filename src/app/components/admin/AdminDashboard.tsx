import React, { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FileText,
  Edit3,
  CheckCircle,
  Settings,
  Calendar,
  GraduationCap,
} from "lucide-react";

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
    title: "Edit Study",
    description: "Modify existing study information and settings",
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
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Study Management Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-base">
          Manage studies, approvals, and training workflows
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.Icon;
          return (
            <div
              key={mod.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${mod.iconBg}`}
              >
                <Icon size={28} className={mod.iconColor} />
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {mod.title}
              </h2>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                {mod.description}
              </p>

              {/* Button */}
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
