import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Mail, Lock, User, BookOpen, Hash, Loader2 } from 'lucide-react';

export default function StudentSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    studentId: '',
    course: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3600/api/student/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      navigate('/student/login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
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
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(192,192,192,0.3)' }}>
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-white font-bold text-lg">BICA+</span>
        </div>

        <div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join the Research<br />Community
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Create your student account and start participating in university research studies to earn course credits.
          </p>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-white font-semibold mb-2">Why participate?</p>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li>🎓 Earn course credits</li>
            <li>🔬 Contribute to real research</li>
            <li>📅 Flexible scheduling</li>
            <li>🏛️ Support your university</li>
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm transition-colors" style={{ color: '#003580' }}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#003580' }}>Create Account</h1>
            <p className="text-gray-500">Sign up to start participating in research studies.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={formData.first_name}
                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Jane"
                    required
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={formData.last_name}
                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Doe"
                    required
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">University Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@university.edu"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="e.g. 20231234"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course / Major</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.course}
                  onChange={e => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g. Psychology"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 mt-2"
              style={{ backgroundColor: loading ? '#C0C0C0' : '#003580' }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : 'Create Student Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/student/login" className="font-semibold hover:underline" style={{ color: '#003580' }}>
              Sign In
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-6">
            BICA+ Research Management System · Student Portal
          </p>
        </div>
      </div>
    </div>
  );
}