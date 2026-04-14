import { Link } from 'react-router';
import { GraduationCap, ShieldCheck, FlaskConical, BookOpen, Users, Award, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>

      {/* Top Nav */}
      <nav style={{ backgroundColor: '#003580' }} className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(192,192,192,0.3)' }}>
            <span className="text-white font-bold">B</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg">BICA+</span>
            <span className="text-blue-200 text-xs ml-2">Systems</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/student/login" className="text-blue-200 hover:text-white transition-colors">Student Login</Link>
          <Link to="/ra/login" className="text-blue-200 hover:text-white transition-colors">RA Login</Link>
          <Link to="/admin/login" className="px-4 py-2 rounded-lg text-white font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 60%, #1565C0 100%)' }} className="px-8 py-24 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#C0C0C0' }} />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#C0C0C0' }} />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{ backgroundColor: 'rgba(192,192,192,0.2)', color: '#C0C0C0' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            University Research Portal
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            BICA+ Research<br />Management System
          </h1>
          <p className="text-blue-200 text-xl mb-10 leading-relaxed">
            A unified platform for students, researchers, and administrators to manage university research participation programs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/student/signup">
              <button className="px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)' }}>
                Get Started as Student <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/ra/signup">
              <button className="px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: 'white', color: '#003580' }}>
                Join as Researcher <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-8 py-6 grid grid-cols-3 gap-8 text-center">
          {[
            { icon: BookOpen, value: 'Active Studies', sub: 'Available to join' },
            { icon: Users, value: 'Participants', sub: 'Enrolled this semester' },
            { icon: Award, value: 'Credits Awarded', sub: 'This academic year' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.value} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#EBF0FA' }}>
                  <Icon className="w-6 h-6" style={{ color: '#003580' }} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">{item.value}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portal Cards */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ color: '#003580' }}>Choose Your Portal</h2>
          <p className="text-gray-500">Select the portal that matches your role at the university</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Student */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="p-1" style={{ background: 'linear-gradient(135deg, #003580, #0047AB)' }} />
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: '#EBF0FA' }}>
                <GraduationCap className="w-7 h-7" style={{ color: '#003580' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#003580' }}>Student Portal</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Browse and register for research studies. Earn course credits by participating in university research programs.
              </p>
              <ul className="text-xs text-gray-400 space-y-2 mb-8">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#003580' }} />Browse available studies</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#003580' }} />Register for timeslots</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#003580' }} />Track earned credits</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#003580' }} />View your schedule</li>
              </ul>
              <div className="space-y-3">
                <Link to="/student/login" className="block">
                  <button className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: '#003580' }}>
                    Student Login
                  </button>
                </Link>
                <Link to="/student/signup" className="block">
                  <button className="w-full py-3 rounded-xl font-semibold text-sm transition-all border-2"
                    style={{ borderColor: '#003580', color: '#003580', backgroundColor: 'transparent' }}>
                    Create Account
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* RA */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="p-1" style={{ background: 'linear-gradient(135deg, #0047AB, #1565C0)' }} />
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: '#EBF0FA' }}>
                <FlaskConical className="w-7 h-7" style={{ color: '#0047AB' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#0047AB' }}>Researcher Portal</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Create and manage research studies. Coordinate participant sessions and track study progress.
              </p>
              <ul className="text-xs text-gray-400 space-y-2 mb-8">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0047AB' }} />Create research studies</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0047AB' }} />Manage timeslots</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0047AB' }} />Track participants</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0047AB' }} />Access training materials</li>
              </ul>
              <div className="space-y-3">
                <Link to="/ra/login" className="block">
                  <button className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: '#0047AB' }}>
                    Researcher Login
                  </button>
                </Link>
                <Link to="/ra/signup" className="block">
                  <button className="w-full py-3 rounded-xl font-semibold text-sm transition-all border-2"
                    style={{ borderColor: '#0047AB', color: '#0047AB', backgroundColor: 'transparent' }}>
                    Create Account
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Admin */}
          <div className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }}>
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Admin Portal</h3>
              <p className="text-blue-200 text-sm mb-6 leading-relaxed">
                Full system access for administrators. Manage users, approve studies, and oversee all research activities.
              </p>
              <ul className="text-xs text-blue-200 space-y-2 mb-8">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-300" />Approve research studies</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-300" />Manage all users</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-300" />System configuration</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-300" />Full reporting access</li>
              </ul>
              <Link to="/admin/login" className="block">
                <button className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: 'white', color: '#003580' }}>
                  Admin Sign In
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#003580' }} className="px-8 py-6 mt-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">BICA+</span>
            <span className="text-blue-200 text-sm">Research Management System</span>
          </div>
          <p className="text-blue-200 text-xs">© 2026 University Research Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}