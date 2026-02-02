import { Link, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { mockStudies } from '@/app/data/mockData';
import { LogOut, User, Plus, Edit, BarChart3, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const activeStudies = mockStudies.filter(s => s.status === 'Active');
  const totalParticipants = mockStudies.reduce((sum, study) => sum + study.currentParticipants, 0);
  const pendingReviews = 5;

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
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-semibold text-purple-600">BICA+ Admin</span>
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
          <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Active Studies</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">{activeStudies.length}</span>
              </div>
            </div>
            <p className="text-3xl font-semibold">{activeStudies.length}</p>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Participants</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">{totalParticipants}</span>
              </div>
            </div>
            <p className="text-3xl font-semibold">{totalParticipants}</p>
          </Card>

          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Pending Reviews</span>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">{pendingReviews}</span>
              </div>
            </div>
            <p className="text-3xl font-semibold">{pendingReviews}</p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to="/admin/study/new" className="w-full">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 h-14">
              <Plus className="w-5 h-5 mr-2" />
              Create New Study
            </Button>
          </Link>

          <Button variant="outline" className="w-full h-14">
            <Edit className="w-5 h-5 mr-2" />
            Edit Existing Study
          </Button>

          <Button variant="outline" className="w-full h-14">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Reports
          </Button>
        </div>

        {/* Studies List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Studies</h2>

          <div className="space-y-4">
            {mockStudies.map((study) => (
              <Card key={study.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold">{study.title}</h3>
                      <Badge
                        className={
                          study.status === 'Active'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : study.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }
                      >
                        {study.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{study.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Credits</p>
                    <p className="font-semibold">{study.credits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{study.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold">{study.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="font-semibold">
                      {study.currentParticipants}/{study.maxParticipants}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/admin/study/${study.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}