import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { ArrowLeft, MapPin, Clock, Award, CheckCircle2, Loader2, Users, BookOpen } from 'lucide-react';

interface Session {
  session_id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  capacity: number;
  available_spots: number;
}

interface Study {
  study_id: number;
  title: string;
  description: string | null;
  credit_value: number | null;
  duration: number | null;
  building: string | null;
  room_number: string | null;
  study_type: string | null;
  status: string | null;
  proctor: string | null;
  department: string | null;
  eligibility_criteria: string | null;
  is_open: boolean;
  sessions: Session[];
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'TBD';
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

const StudyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [study, setStudy] = useState<Study | null>(null);
  const [loadingStudy, setLoadingStudy] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [regStep, setRegStep] = useState<'select' | 'submitting' | 'success'>('select');
  const [regError, setRegError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') navigate('/student/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const res = await fetch(`http://localhost:3600/api/studies/${id}`);
        if (!res.ok) throw new Error('Study not found');
        const data = await res.json();
        setStudy({ ...data, sessions: data.sessions || [] });
      } catch (err: any) {
        setFetchError(err.message || 'Failed to load study');
      } finally {
        setLoadingStudy(false);
      }
    };
    if (id) fetchStudy();
  }, [id]);

  if (!user || user.role !== 'student') return null;

  if (loadingStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#003580' }} />
          <p className="text-gray-500">Loading study details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !study) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F6F9' }}>
        <Card className="p-10 text-center max-w-md border-0 shadow-md">
          <BookOpen className="w-14 h-14 mx-auto mb-4" style={{ color: '#C0C0C0' }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: '#003580' }}>Study Not Found</h2>
          <p className="text-gray-500 mb-6">{fetchError}</p>
          <Link to="/student/dashboard">
            <Button style={{ backgroundColor: '#003580' }} className="text-white">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Success Screen
  if (regStep === 'success' && selectedSession) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
        <header style={{ backgroundColor: '#003580' }} className="shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link to="/student/dashboard" className="inline-flex items-center text-blue-200 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="p-10 text-center border-0 shadow-lg">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#E8F5E9' }}>
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#003580' }}>Registration Successful!</h2>
            <p className="text-gray-500 mb-8">You're all set for this study session.</p>

            <div className="rounded-xl p-6 text-left mb-8" style={{ backgroundColor: '#EBF0FA' }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#003580' }}>{study.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1 text-xs uppercase tracking-wide">Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedSession.session_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-xs uppercase tracking-wide">Time</p>
                  <p className="font-semibold text-gray-800">{formatTime(selectedSession.start_time)} – {formatTime(selectedSession.end_time)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-xs uppercase tracking-wide">Location</p>
                  <p className="font-semibold text-gray-800">{selectedSession.location || `${study.building} ${study.room_number}` || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-xs uppercase tracking-wide">Credits</p>
                  <p className="font-semibold text-gray-800">{study.credit_value} Credits</p>
                </div>
              </div>
            </div>

            <Link to="/student/dashboard">
              <Button className="w-full text-white font-semibold py-3" style={{ backgroundColor: '#003580' }}>
                Back to Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Submitting Screen
  if (regStep === 'submitting') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F6F9' }}>
        <Card className="p-12 text-center max-w-md border-0 shadow-lg">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6" style={{ color: '#003580' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#003580' }}>Confirming Registration</h2>
          <p className="text-gray-500">Please wait while we secure your spot...</p>
        </Card>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!selectedSession) return;
    setRegStep('submitting');
    setRegError('');
    try {
      const res = await fetch('http://localhost:3600/api/signups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: user.id,
          study_id: study.study_id,
          session_id: selectedSession.session_id,
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setRegError('You are already registered for this study.');
        setRegStep('select');
        return;
      }
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setRegStep('success');
    } catch (err: any) {
      setRegError(err.message || 'Something went wrong.');
      setRegStep('select');
    }
  };

  const availableSessions = study.sessions.filter(s => s.available_spots > 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#003580' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/student/dashboard" className="inline-flex items-center text-blue-200 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Study Hero */}
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {study.department && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(192,192,192,0.3)', color: '#E0E7FF' }}>
                    {study.department}
                  </span>
                )}
                {study.study_type && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#E0E7FF' }}>
                    {study.study_type}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{study.title}</h1>
              {study.proctor && <p className="text-blue-200 text-sm">Conducted by {study.proctor}</p>}
            </div>
            <div className="text-right">
              {study.credit_value && (
                <div className="bg-white rounded-xl px-5 py-3 text-center shadow-md">
                  <p className="text-3xl font-bold" style={{ color: '#003580' }}>{study.credit_value}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Credits</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — Study Info + Slot Selection */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            {study.description && (
              <Card className="p-6 border-0 shadow-sm">
                <h2 className="font-bold text-lg mb-3" style={{ color: '#003580' }}>About This Study</h2>
                <p className="text-gray-600 leading-relaxed">{study.description}</p>
              </Card>
            )}

            {/* Eligibility */}
            {study.eligibility_criteria && (
              <Card className="p-6 border-0 shadow-sm" style={{ borderLeft: '4px solid #003580' }}>
                <h2 className="font-bold text-lg mb-2" style={{ color: '#003580' }}>Eligibility Criteria</h2>
                <p className="text-gray-600 text-sm">{study.eligibility_criteria}</p>
              </Card>
            )}

            {/* Time Slot Selection */}
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg" style={{ color: '#003580' }}>Select a Time Slot</h2>
                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#EBF0FA', color: '#003580' }}>
                  {availableSessions.length} available
                </span>
              </div>

              {study.sessions.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 mx-auto mb-3" style={{ color: '#C0C0C0' }} />
                  <p className="text-gray-500">No sessions scheduled yet.</p>
                  <p className="text-gray-400 text-sm mt-1">Check back later.</p>
                </div>
              )}

              <div className="space-y-3">
                {study.sessions.map((session) => {
                  const full = session.available_spots <= 0;
                  const selected = selectedSession?.session_id === session.session_id;
                  return (
                    <button
                      key={session.session_id}
                      onClick={() => !full && setSelectedSession(session)}
                      disabled={full}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        full ? 'opacity-50 cursor-not-allowed'
                        : selected ? 'shadow-md'
                        : 'hover:shadow-sm'
                      }`}
                      style={{
                        backgroundColor: selected ? '#003580' : full ? '#F3F4F6' : 'white',
                        borderColor: selected ? '#003580' : full ? '#E5E7EB' : '#E5E7EB',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${selected ? 'text-white' : 'text-gray-800'}`}>
                            {formatDate(session.session_date)}
                          </p>
                          <p className={`text-sm mt-0.5 ${selected ? 'text-blue-200' : 'text-gray-500'}`}>
                            {formatTime(session.start_time)} – {formatTime(session.end_time)}
                            {session.location && ` · ${session.location}`}
                          </p>
                        </div>
                        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          full ? 'bg-gray-200 text-gray-500'
                          : selected ? 'bg-blue-400 text-white'
                          : 'text-green-700'
                        }`}
                        style={!full && !selected ? { backgroundColor: '#E8F5E9' } : {}}>
                          {full ? 'Full' : `${session.available_spots} spot${session.available_spots !== 1 ? 's' : ''} left`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {regError && (
                <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <span>⚠️</span> {regError}
                </div>
              )}

              <Button
                onClick={handleConfirm}
                disabled={!selectedSession}
                className="w-full mt-5 py-3 font-semibold text-white transition-all"
                style={{
                  backgroundColor: selectedSession ? '#003580' : '#C0C0C0',
                  cursor: selectedSession ? 'pointer' : 'not-allowed',
                }}
              >
                {selectedSession ? 'Confirm Registration' : 'Select a Time Slot to Continue'}
              </Button>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <Card className="p-5 border-0 shadow-sm">
              <h3 className="font-bold mb-4" style={{ color: '#003580' }}>Study Details</h3>
              <div className="space-y-3">
                {study.credit_value && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                      <Award className="w-4 h-4" style={{ color: '#003580' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Credits</p>
                      <p className="font-semibold text-gray-800">{study.credit_value}</p>
                    </div>
                  </div>
                )}
                {study.duration && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                      <Clock className="w-4 h-4" style={{ color: '#003580' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="font-semibold text-gray-800">{study.duration} minutes</p>
                    </div>
                  </div>
                )}
                {study.building && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                      <MapPin className="w-4 h-4" style={{ color: '#003580' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="font-semibold text-gray-800">{study.building} {study.room_number}</p>
                    </div>
                  </div>
                )}
                {study.sessions.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EBF0FA' }}>
                      <Users className="w-4 h-4" style={{ color: '#003580' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Sessions</p>
                      <p className="font-semibold text-gray-800">{availableSessions.length} available</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyDetails;