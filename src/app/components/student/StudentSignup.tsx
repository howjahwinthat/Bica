import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { useAuth } from '@/app/context/AuthContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function StudentSignup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    course: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show success message
    setShowSuccess(true);
  };

  const handleContinue = () => {
    // Simulate successful signup and login
    login({
      id: 'S' + Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: 'student',
      studentId: formData.studentId,
      course: formData.course,
      credits: 0,
    });
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <span className="ml-3 text-2xl font-semibold text-blue-600">BICA+ Systems</span>
        </div>

        {!showSuccess ? (
          <Card className="max-w-md mx-auto p-8">
            <h1 className="text-2xl font-semibold mb-6 text-center">Create Student Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name:</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email:</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="studentId">Student ID:</Label>
                <Input
                  id="studentId"
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="course">Course:</Label>
                <Input
                  id="course"
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g., PSYCH 200"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password:</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign Up
              </Button>
            </form>

            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/student/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </Card>
        ) : (
          <Card className="max-w-md mx-auto p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-blue-600">Sign Up Successful!</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-2">A confirmation link has been sent to:</p>
              <p className="font-semibold text-gray-900">{formData.email}</p>
            </div>
            <Button onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-700">
              Continue to Dashboard
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}