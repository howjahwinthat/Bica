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

export function StudyDetails() {
  const { id } = useParams();
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
              <span className="text-blue-800">Available Slots Updated</span>
              <span className="text-blue-800 font-semibold">
                {(selectedSlotData?.available || 1) - 1} slots remaining
              </span>
            </div>

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

  if (registrationStep === 'validating') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Validating Registration</h2>
          <p className="text-gray-600 mb-6">Please wait while we process your registration...</p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm">Checking slot availability</span>
            </div>
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-sm">Registering student to study</span>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              <span className="text-sm">Updating slot count</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Group time slots by date
  const slotsByDate = study.timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof study.timeSlots>);

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
          {/* Study Details */}
          <div className="lg:col-span-2">
            <Card className="p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-semibold">{study.title}</h1>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {study.status}
                </Badge>
              </div>

              <p className="text-gray-600 mb-6">{study.description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-600">{study.duration}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Credits</p>
                    <p className="text-gray-600">{study.credits} Credits</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{study.location}, {study.room}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Time Slot Selection */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-4">Select a Time Slot</h2>
              <p className="text-gray-600 mb-6">{study.timeSlots.length} slots available</p>

              <div className="space-y-6">
                {Object.entries(slotsByDate).map(([date, slots]) => (
                  <div key={date}>
                    <h3 className="font-medium mb-3">{date}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          disabled={slot.available === 0}
                          className={`
                            p-4 rounded-lg border-2 transition-all text-left
                            ${slot.available === 0
                              ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                              : selectedSlot === slot.id
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white border-gray-200 hover:border-blue-400'
                            }
                          `}
                        >
                          <p className="font-medium">{slot.time}</p>
                          <p className={`text-sm ${selectedSlot === slot.id ? 'text-blue-100' : 'text-gray-500'}`}>
                            {slot.available === 0 ? 'Full' : `${slot.available} spots left`}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
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

          {/* Sidebar */}
          <div>
            <Card className="p-6 sticky top-6">
              <h3 className="font-semibold mb-4">Registration Summary</h3>
              
              {selectedSlot ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Selected Time</p>
                    <p className="font-medium">{selectedSlotData?.date}</p>
                    <p className="font-medium">{selectedSlotData?.time}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Credits to Earn</p>
                    <p className="text-2xl font-semibold text-green-600">{study.credits}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Spots Available</p>
                    <Progress value={(selectedSlotData?.available || 0) / (selectedSlotData?.total || 1) * 100} className="mb-2" />
                    <p className="text-sm text-gray-600">
                      {selectedSlotData?.available} of {selectedSlotData?.total} spots remaining
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a time slot to see details</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}