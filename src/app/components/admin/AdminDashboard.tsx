import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { useAuth } from "@/app/context/AuthContext";
import { ShieldCheck, Calendar, Plus } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Redirect to login if not an admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button
          onClick={() => logout()}
          className="bg-red-600 hover:bg-red-700"
        >
          Logout
        </Button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Studies</h2>
          <p className="text-gray-600 text-center mb-4">
            Create, edit, or remove studies for students.
          </p>
          <Link to="/admin/study/new" className="w-full">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              New Study
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Timeslots</h2>
          <p className="text-gray-600 text-center mb-4">
            Create, edit, or remove available time slots for studies.
          </p>
          <Link to="/admin/timeslot/new" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              New Timeslot
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Other Actions</h2>
          <p className="text-gray-600 text-center">
            Access reports, settings, and other administrative tools.
          </p>
          <Button
            onClick={() => alert("Feature coming soon!")}
            className="w-full bg-green-600 hover:bg-green-700 mt-2"
          >
            Open
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;