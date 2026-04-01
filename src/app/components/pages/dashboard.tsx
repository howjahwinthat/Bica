import { Link } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
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
import { useEffect, useState } from "react";

type Stats = {
  totalStudies: number;
  pendingApprovals: number;
  totalStudents: number;
  totalRAs: number;
};

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudies: 0,
    pendingApprovals: 0,
    totalStudents: 0,
    totalRAs: 0,
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Study Management Dashboard</h1>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Studies</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{stats.totalStudies}</p>
        </Card>
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Approvals</span>
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-700">{stats.pendingApprovals}</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Students</span>
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">{stats.totalStudents}</p>
        </Card>
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total RAs</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700">{stats.totalRAs}</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Create Study</h2>
          <p className="text-gray-600 text-center mb-4">
            Set up a new research study with all required details
          </p>
          <Link to="/create-study" className="w-full mt-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Create New Study
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Edit3 className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Edit Study</h2>
          <p className="text-gray-600 text-center mb-4">
            Modify existing study information and settings
          </p>
          <Link to="/edit-study" className="w-full mt-auto">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              Edit Studies
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Study Approval</h2>
          <p className="text-gray-600 text-center mb-4">
            Review and approve pending study requests
          </p>
          <Link to="/study-approval" className="w-full mt-auto">
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              Review Approvals
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Study Rules</h2>
          <p className="text-gray-600 text-center mb-4">
            Set study-specific rules and requirements
          </p>
          <Link to="/study-rules" className="w-full mt-auto">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Configure Rules
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Session Management</h2>
          <p className="text-gray-600 text-center mb-4">
            Create and manage study session IDs
          </p>
          <Link to="/session-management" className="w-full mt-auto">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Manage Sessions
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Training Portal</h2>
          <p className="text-gray-600 text-center mb-4">
            Access training and onboarding workflows
          </p>
          <Link to="/training" className="w-full mt-auto">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Start Training
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600 text-center mb-4">
            View and manage student and RA accounts
          </p>
          <Link to="/user-management" className="w-full mt-auto">
            <Button className="w-full bg-gray-600 hover:bg-gray-700">
              Manage Users
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}