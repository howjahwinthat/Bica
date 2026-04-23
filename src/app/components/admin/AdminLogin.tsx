// Responsible Party: Brooke
// Contributors: Clifford & Ishmel
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Loader2, Lock, Mail } from "lucide-react";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3600/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F4F6F9' }}>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(192,192,192,0.3)' }}>
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <span className="text-white font-bold text-xl">BICA+</span>
            <p className="text-blue-200 text-xs">Research Management System</p>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Manage Research<br />Studies with Ease
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            A comprehensive platform for university research administration, participant management, and study coordination.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Active Studies', value: '12+' },
            { label: 'Participants', value: '500+' },
            { label: 'Departments', value: '8' },
            { label: 'Credits Awarded', value: '1,200+' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#003580' }}>
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl" style={{ color: '#003580' }}>BICA+</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#003580' }}>Admin Portal</h1>
            <p className="text-gray-500">Sign in to manage your research studies</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@university.edu"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': '#003580' } as any}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': '#003580' } as any}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 mt-2"
              style={{ backgroundColor: loading ? '#C0C0C0' : '#003580' }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                'Sign In to Admin Portal'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            BICA+ Research Management System · University Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
