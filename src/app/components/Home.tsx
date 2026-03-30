import { Link } from 'react-router';
import { GraduationCap, ShieldCheck, FlaskConical } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="flex items-center flex-col mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">BICA+ Systems</h1>
          <p className="text-gray-600">Research Management Portal</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Student Portal</h2>
              <p className="text-gray-600 mb-6">
                Participate in research studies and earn credits
              </p>
              <div className="flex flex-col gap-3 w-full">
                <Link to="/student/signup" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/student/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FlaskConical className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">RA Portal</h2>
              <p className="text-gray-600 mb-6">
                Create and manage research studies as a Research Assistant
              </p>
              <div className="flex flex-col gap-3 w-full">
                <Link to="/ra/signup" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/ra/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Admin Portal</h2>
              <p className="text-gray-600 mb-6">
                Manage studies and participant registrations
              </p>
              <div className="flex flex-col gap-3 w-full">
                <Link to="/admin/login" className="w-full">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Admin Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}