import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { LogOut, User, BookOpen, Award, Calendar, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/student/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch('http://localhost:3600/api/studies');
        const data = await res.json();
        const active = data.filter((s: Study) => s.status === 'active');
        setStudies(active);
      } catch (err) {
        console.error('Failed to load studies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudies();
  }, []);

  if (!user || user.role !== 'student') return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-blue-600">BICA + systems</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Dashboard</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Active Studies</span>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-semibold">{studies.length}</p>
          </Card>
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Credits Earned</span>
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-semibold">0</p>
          </Card>
          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Available</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-semibold">{studies.length}</p>
          </Card>
        </div>

        <div className="mb-6">
          <Link to="/student/calendar">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              <Calendar className="w-4 h-4 mr-2" /> View My Calendar
            </Button>
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Studies</h2>
            <span className="text-gray-600">{studies.length} studies</span>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading studies...</span>
            </div>
          )}

          {!loading && studies.length === 0 && (
            <Card className="p-8 text-center text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No studies available right now</p>
              <p className="text-sm mt-1">Check back later.</p>
            </Card>
          )}

          <div className="space-y-4">
            {studies.map((study) => (
              <Card key={study.study_id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold">{study.title}</h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                    </div>
                    {study.description && (
                      <p className="text-gray-600 mb-3">{study.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {study.duration && <span><span className="font-medium">Duration:</span> {study.duration} min</span>}
                      {study.building && <span><span className="font-medium">Location:</span> {study.building} {study.room_number}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {study.credit_value && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">{study.credit_value} Credits</Badge>
                  )}
                  {study.study_type && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">{study.study_type}</Badge>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  <Link to={`/student/study/${study.study_id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">Register</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}