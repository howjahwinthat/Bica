import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { ArrowLeft, MapPin, Clock, Award, CheckCircle2, Loader2 } from 'lucide-react';

type Study = {
  study_id: number;
  title: string;
  description: string | null;
  proctor: string | null;
  department: string | null;
  study_type: string | null;
  duration: number | null;
  credit_value: number | null;
  max_participants: number | null;
  eligibility_criteria: string | null;
  status: string | null;
  building: string | null;
  room_number: string | null;
  is_open: boolean;
  created_at: string;
};

type RegistrationStep = 'view' | 'loading' | 'success' | 'already_registered';

const StudyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [study, setStudy] = useState<Study | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('view');

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/student/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const res = await fetch(`http://localhost:3600/api/studies/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStudy(data);
        }
      } catch (err) {
        console.error('Failed to load study', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudy();
  }, [id]);

  if (!user || user.role !== 'student') return null;

  const handleRegister = async () => {
    if (!user?.id || !study) return;
    setRegistrationStep('loading');
    try {
      const res = await fetch('http://localhost:3600/api/signups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: user.id, study_id: study.study_id }),
      });
      if (res.status === 409) {
        setRegistrationStep('already_registered');
        return;
      }
      if (!res.ok) throw new Error('Failed to register');
      setRegistrationStep('success');
    } catch (err) {
      console.error(err);
      setRegistrationStep('view');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!study) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Study not found</h2>
          <Link to="/student/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Loading Screen
  if (registrationStep === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Registering...</h2>
          <p className="text-gray-600">Please wait while we process your registration.</p>
        </Card>
      </div>
    );
  }

  // Already Registered Screen
  if (registrationStep === 'already_registered') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Already Registered</h2>
          <p className="text-gray-600 mb-6">You have already signed up for this study.</p>
          <Link to="/student/dashboard">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Success Screen
  if (registrationStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link to="/student/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            </div>
            <h2 className="text-3xl font-semibold mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-8">You have been registered for this study.</p>

            <Card className="p-6 bg-gray-50 text-left mb-6">
              <h3 className="font-semibold mb-4">{study.title}</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {study.building && (
                  <div>
                    <p className="text-gray-600 mb-1">Location</p>
                    <p className="font-medium">{study.building} {study.room_number}</p>
                  </div>
                )}
                {study.duration && (
                  <div>
                    <p className="text-gray-600 mb-1">Duration</p>
                    <p className="font-medium">{study.duration} min</p>
                  </div>
                )}
                {study.credit_value && (
                  <div>
                    <p className="text-gray-600 mb-1">Credits</p>
                    <p className="font-medium">{study.credit_value} Credits</p>
                  </div>
                )}
                {study.department && (
                  <div>
                    <p className="text-gray-600 mb-1">Department</p>
                    <p className="font-medium">{study.department}</p>
                  </div>
                )}
              </div>
            </Card>

            <Link to="/student/dashboard">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Back to Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Main Study Details View
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/student/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-semibold">{study.title}</h1>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {study.status}
            </Badge>
          </div>

          {study.description && (
            <p className="text-gray-600 mb-6">{study.description}</p>
          )}

          <div className="grid md:grid-cols-2 gap-4 text-sm mb-6">
            {study.department && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">Department:</span> {study.department}
              </div>
            )}
            {study.study_type && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">Type:</span> {study.study_type}
              </div>
            )}
            {study.duration && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Duration:</span> {study.duration} min
              </div>
            )}
            {study.credit_value && (
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-4 h-4" />
                <span className="font-medium">Credits:</span> {study.credit_value}
              </div>
            )}
            {study.building && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Location:</span> {study.building} {study.room_number}
              </div>
            )}
            {study.proctor && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">Proctor:</span> {study.proctor}
              </div>
            )}
          </div>

          {study.eligibility_criteria && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="font-medium text-yellow-800 mb-1">Eligibility Criteria</p>
              <p className="text-yellow-700 text-sm">{study.eligibility_criteria}</p>
            </div>
          )}

          {study.is_open ? (
            <Button
              onClick={handleRegister}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Register for Study
            </Button>
          ) : (
            <Button disabled className="w-full">
              Registration Closed
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudyDetails;