import React from "react";
import { useAuth } from "@/app/context/AuthContext";

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
      {user && (
        <p className="mb-6">
          Welcome, <strong>{user.email}</strong>!
        </p>
      )}
      <button
        onClick={logout}
        className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;