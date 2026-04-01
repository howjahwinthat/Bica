import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { LogOut, User, BookOpen, Award, Calendar, Loader2, Search } from 'lucide-react';
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
  department: string;
  status: string;
}

interface Signup {
  signup_id: number;
  study_id: number;
  title: string;
  credit_value: number;
  duration: string;
  building: string;
  room_number: string;
  study_type: string;
  status: string;
  signed_up_at: string;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [signedUpStudyIds, setSignedUpStudyIds] = useState<number[]>([]);

  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCredits, setFilterCredits] = useState("");

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

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`http://localhost:3600/api/students/${user.id}/credits`);
        if (res.ok) {
          const data = await res.json();
          setTotalCredits(Number(data.total_credits) || 0);
        }
      } catch (err) {
        console.error('Failed to load credits', err);
      }
    };
    fetchCredits();
  }, [user]);

  useEffect(() => {
    const fetchSignups = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`http://localhost:3600/api/signups/student/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setSignups(data);
          setSignedUpStudyIds(data.map((s: any) => s.study_id));
        }
      } catch (err) {
        console.error('Failed to load signups', err);
      }
    };
    fetchSignups();
  }, [user]);

  if (!user || user.role !== 'student') return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getSignupStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Registered</Badge>;
      case 'attended':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Attended</Badge>;
      case 'no_show':
        return <Badge className="bg-red-100 text-red-700 border-red-200">No Show</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredStudies = studies.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = filterDepartment ? s.department === filterDepartment : true;
    const matchesType = filterType ? s.study_type === filterType : true;
    const matchesCredits = filterCredits ? String(s.credit_value) === filterCredits : true;
    return matchesSearch && matchesDepartment && matchesType && matchesCredits;
  });

  const activeSignups = signups.filter(s => s.status !== 'cancelled');

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
            <p className="text-3xl font-semibold">{totalCredits.toFixed(1)}</p>
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

        {/* Registered Studies Section */}
        {activeSignups.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Registered Studies</h2>
              <span className="text-gray-600">{activeSignups.length} registered</span>
            </div>
            <div className="space-y-3">
              {activeSignups.map((signup) => (
                <Card key={signup.signup_id} className="p-5 border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{signup.title}</h3>
                        {getSignupStatusBadge(signup.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {signup.duration && (
                          <span><span className="font-medium">Duration:</span> {signup.duration} min</span>
                        )}
                        {signup.building && (
                          <span><span className="font-medium">Location:</span> {signup.building} {signup.room_number}</span>
                        )}
                        {signup.credit_value && (
                          <span><span className="font-medium">Credits:</span> {signup.credit_value}</span>
                        )}
                        <span className="text-gray-400">
                          Registered {new Date(signup.signed_up_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Studies Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Studies</h2>
            <span className="text-gray-600">{filteredStudies.length} studies</span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 p-2 border rounded bg-white"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="p-2 border rounded text-sm bg-white"
              >
                <option value="">All Departments</option>
                <option value="Psychology">Psychology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Information Science">Information Science</option>
                <option value="Biology">Biology</option>
                <option value="Business">Business</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Accounting">Accounting</option>
                <option value="Communication">Communication</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border rounded text-sm bg-white"
              >
                <option value="">All Types</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <select
                value={filterCredits}
                onChange={(e) => setFilterCredits(e.target.value)}
                className="p-2 border rounded text-sm bg-white"
              >
                <option value="">All Credits</option>
                <option value="1">1.0</option>
                <option value="2">2.0</option>
                <option value="3">3.0</option>
                <option value="4">4.0</option>
                <option value="5">5.0</option>
              </select>
            </div>
            {(search || filterDepartment || filterType || filterCredits) && (
              <p className="text-sm text-gray-500">
                Showing {filteredStudies.length} of {studies.length} studies
                <button
                  className="ml-2 text-blue-600 hover:underline"
                  onClick={() => { setSearch(""); setFilterDepartment(""); setFilterType(""); setFilterCredits(""); }}
                >
                  Clear filters
                </button>
              </p>
            )}
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

          {!loading && studies.length > 0 && filteredStudies.length === 0 && (
            <Card className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No studies match your search</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
            </Card>
          )}

          <div className="space-y-4">
            {filteredStudies.map((study) => (
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
                  {study.department && (
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">{study.department}</Badge>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  {signedUpStudyIds.includes(study.study_id) ? (
                    <Button disabled className="bg-gray-400 cursor-not-allowed">
                      Already Registered
                    </Button>
                  ) : (
                    <Link to={`/student/study/${study.study_id}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700">Register</Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}