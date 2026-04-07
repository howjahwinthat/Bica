import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { LogOut, User, BookOpen, Award, Calendar, Loader2, Search, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Study {
  study_id: number;
  title: string;
  description: string;
  credit_value: number;
  duration: string;
  building: string;
  room_number: string;
  study_type: string;
  status: string;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') navigate('/student/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch('http://localhost:3600/api/studies');
        const data = await res.json();
        setStudies(data.filter((s: Study) => s.status === 'active'));
      } catch (err) {
        console.error('Failed to load studies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudies();
  }, []);

  if (!user || user.role !== 'student') return null;

  const handleLogout = () => { logout(); navigate('/'); };

  const filtered = studies.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>

      {/* Top Nav */}
      <header style={{ backgroundColor: '#003580' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#C0C0C0' }}>
              <span className="font-bold text-lg" style={{ color: '#003580' }}>B</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-wide">BICA+</span>
              <span className="text-blue-200 text-xs block">Research Participation Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-blue-200 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 bg-blue-700 rounded-full px-4 py-2">
              <div className="w-7 h-7 rounded-full bg-blue-300 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-800" />
              </div>
              <span className="text-white text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-blue-200">Explore and register for research studies below.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-8 -mt-6">
          <Card className="p-5 shadow-md border-0" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Available Studies</p>
                <p className="text-3xl font-bold mt-1" style={{ color: '#003580' }}>{studies.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                <BookOpen className="w-6 h-6" style={{ color: '#003580' }} />
              </div>
            </div>
          </Card>
          <Card className="p-5 shadow-md border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Credits Earned</p>
                <p className="text-3xl font-bold mt-1" style={{ color: '#003580' }}>0</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                <Award className="w-6 h-6" style={{ color: '#003580' }} />
              </div>
            </div>
          </Card>
          <Card className="p-5 shadow-md border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>My Schedule</p>
                <p className="text-3xl font-bold mt-1" style={{ color: '#003580' }}>
                  <Link to="/student/calendar" className="hover:underline">View</Link>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                <Calendar className="w-6 h-6" style={{ color: '#003580' }} />
              </div>
            </div>
          </Card>
        </div>

        {/* Search + Calendar Button Row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search studies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#003580' } as any}
            />
          </div>
          <Link to="/student/calendar">
            <Button variant="outline" className="border-2 font-medium" style={{ borderColor: '#003580', color: '#003580' }}>
              <Calendar className="w-4 h-4 mr-2" /> My Calendar
            </Button>
          </Link>
        </div>

        {/* Studies Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#003580' }}>Available Studies</h2>
          <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#EBF0FA', color: '#003580' }}>
            {filtered.length} {filtered.length === 1 ? 'study' : 'studies'}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#003580' }} />
            <span className="ml-3 text-gray-500">Loading studies...</span>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <Card className="p-12 text-center border-0 shadow-sm">
            <BookOpen className="w-14 h-14 mx-auto mb-4" style={{ color: '#C0C0C0' }} />
            <p className="font-semibold text-gray-600">No studies found</p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? 'Try a different search term.' : 'Check back later for available studies.'}
            </p>
          </Card>
        )}

        {/* Study Cards */}
        <div className="space-y-4">
          {filtered.map((study) => (
            <Card key={study.study_id} className="p-6 border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold" style={{ color: '#003580' }}>{study.title}</h3>
                    <Badge className="text-xs font-semibold" style={{ backgroundColor: '#EBF0FA', color: '#003580', border: 'none' }}>
                      Active
                    </Badge>
                    {study.study_type && (
                      <Badge className="text-xs" style={{ backgroundColor: '#F3F4F6', color: '#6B7280', border: 'none' }}>
                        {study.study_type}
                      </Badge>
                    )}
                  </div>
                  {study.description && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{study.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {study.duration && (
                      <span>⏱ {study.duration} min</span>
                    )}
                    {study.building && (
                      <span>📍 {study.building} {study.room_number}</span>
                    )}
                    {study.credit_value && (
                      <span>🎓 {study.credit_value} {Number(study.credit_value) === 1 ? 'Credit' : 'Credits'}</span>
                    )}
                  </div>
                </div>
                <Link to={`/student/study/${study.study_id}`}>
                  <Button
                    className="font-semibold text-white shrink-0"
                    style={{ backgroundColor: '#003580' }}
                  >
                    View & Register
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}