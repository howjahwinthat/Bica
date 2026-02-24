// src/app/components/student/StudyDetails.tsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { useAuth } from '@/app/context/AuthContext';
import { mockStudies } from '@/app/data/mockData';
import { ArrowLeft, MapPin, Clock, Award, CheckCircle2, Loader2 } from 'lucide-react';

type RegistrationStep = 'select' | 'validating' | 'success';

const StudyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('select');

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/student/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'student') {
    return null;
  }

  const study = mockStudies.find((s) => s.id === id);

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

  const handleConfirmRegistration = () => {
    if (!selectedSlot) return;
    setRegistrationStep('validating');

    // Simulate validation process
    setTimeout(() => {
      setRegistrationStep('success');
    }, 2000);
  };

  const selectedSlotData = study.timeSlots.find((slot) => slot.id === selectedSlot);

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
            <p className="text-gray-600 mb-8">You have been registered for the study</p>

            <Card className="p-6 bg-gray-50 text-left mb-6">
              <h3 className="font-semibold mb-4">Study</h3>
              <p className="text-lg mb-4">{study.title}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="font-medium">{selectedSlotData?.date}</p>
                  <p className="font-medium">{selectedSlotData?.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="font-medium">{study.location}</p>
                  <p className="font-medium">{study.room}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="font-medium">{study.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Credits</p>
                  <p className="font-medium">{study.credits} Credits</p>
                </div>
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

  // Validating Screen
  if (registrationStep === 'validating') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Validating Registration</h2>
          <p className="text-gray-600 mb-6">Please wait while we process your registration...</p>
        </Card>
      </div>
    );
  }

  // Main Study Details / Slot Selection
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-semibold">{study.title}</h1>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {study.status}
                </Badge>
              </div>
              <p className="text-gray-600 mb-6">{study.description}</p>
            </Card>

            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-4">Select a Time Slot</h2>
              <div className="space-y-6">
                {study.timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    disabled={slot.available === 0}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      slot.available === 0
                        ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                        : selectedSlot === slot.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <p className="font-medium">{slot.time}</p>
                    <p className={`text-sm ${selectedSlot === slot.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {slot.available === 0 ? 'Full' : `${slot.available} spots left`}
                    </p>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleConfirmRegistration}
                disabled={!selectedSlot}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Registration
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyDetails;