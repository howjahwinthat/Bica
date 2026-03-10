import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { mockStudies } from '@/app/data/mockData';
import { LogOut, User, BookOpen, Award, Calendar } from 'lucide-react';
import { useEffect } from 'react';
export function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/student/login');
    }
  }, [user, navigate]);
  if (!user || user.role !== 'student') {
    return null;
  }
  const activeStudies = mockStudies.filter(s => s.status === 'Active');
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-600">Dashboard</p>
        </div>
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Active Studies</span>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-semibold">3</p>
          </Card>
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Credits Earned</span>
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-semibold">12</p>
          </Card>
          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Available</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-semibold">25</p>
          </Card>
        </div>
        {/* View Available Studies Button */}
        <div className="mb-6">
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-lg py-6">
            View Available Studies
          </Button>
        </div>
        {/* Available Studies List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Studies</h2>
            <span className="text-gray-600">{activeStudies.length} studies</span>
          </div>
          <div className="space-y-4">
            {activeStudies.map((study) => (
              <Card key={study.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold">{study.title}</h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {study.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{study.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-600">
                        <span className="font-medium">Duration:</span> {study.duration}
                      </span>
                      <span className="text-gray-600">
                        <span className="font-medium">Location:</span> {study.location}, {study.room}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {study.credits} Credits
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    {study.type}
                  </Badge>
                  {study.dateRange && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      {study.dateRange}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {study.timeSlots.length} slots available
                  </span>
                  <Link to={`/student/study/${study.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Register
                    </Button>
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
