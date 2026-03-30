import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  FileText,
  Edit3,
  Settings,
  Calendar,
  GraduationCap,
} from "lucide-react";

export function RADashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">RA Dashboard</h1>
        <p className="text-gray-500 mt-1">Research Assistant Portal</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Create Study</h2>
          <p className="text-gray-600 text-center mb-4">Set up a new research study with all required details</p>
          <Link to="/create-study" className="w-full mt-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Create New Study</Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Edit3 className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Edit Study</h2>
          <p className="text-gray-600 text-center mb-4">Modify existing study information and settings</p>
          <Link to="/edit-study" className="w-full mt-auto">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Edit Studies</Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Study Rules</h2>
          <p className="text-gray-600 text-center mb-4">Set study-specific rules and requirements</p>
          <Link to="/study-rules" className="w-full mt-auto">
            <Button className="w-full bg-red-600 hover:bg-red-700">Configure Rules</Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Session Management</h2>
          <p className="text-gray-600 text-center mb-4">Create and manage study session IDs</p>
          <Link to="/session-management" className="w-full mt-auto">
            <Button className="w-full bg-green-600 hover:bg-green-700">Manage Sessions</Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Training Portal</h2>
          <p className="text-gray-600 text-center mb-4">Access training and onboarding workflows</p>
          <Link to="/training" className="w-full mt-auto">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Training</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}