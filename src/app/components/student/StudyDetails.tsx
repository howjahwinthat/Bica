import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { ArrowLeft, MapPin, Clock, Award, CheckCircle2, Loader2 } from 'lucide-react';

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
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (fetchError || !study) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Study not found</h2>
          <p className="text-gray-500 mb-4">{fetchError}</p>
          <Link to="/student/dashboard"><Button>Back to Dashboard</Button></Link>
        </Card>
      </div>
    );
  }

  if (regStep === 'success' && selectedSession) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link to="/student/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Card className="p-8 text-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-8">You have been registered for this study.</p>
            <Card className="p-6 bg-gray-50 text-left mb-6">
              <h3 className="font-semibold mb-4">{study.title}</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Date</p>
                  <p className="font-medium">{formatDate(selectedSession.session_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Time</p>
                  <p className="font-medium">{formatTime(selectedSession.start_time)} – {formatTime(selectedSession.end_time)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Location</p>
                  <p className="font-medium">{selectedSession.location || `${study.building} ${study.room_number}` || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Credits</p>
                  <p className="font-medium">{study.credit_value} Credits</p>
                </div>
              </div>
            </Card>
            <Link to="/student/dashboard">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (regStep === 'submitting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-2">Registering...</h2>
          <p className="text-gray-600">Please wait while we confirm your spot.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/student/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-semibold">{study.title}</h1>
            <Badge className="bg-green-100 text-green-700 border-green-200 ml-4">Active</Badge>
          </div>
          {study.description && <p className="text-gray-600 mb-4">{study.description}</p>}
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            {study.department && <div><span className="font-medium">Department:</span> {study.department}</div>}
            {study.study_type && <div><span className="font-medium">Type:</span> {study.study_type}</div>}
            {study.duration && <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span className="font-medium">Duration:</span> {study.duration} min</div>}
            {study.credit_value && <div className="flex items-center gap-1"><Award className="w-4 h-4" /><span className="font-medium">Credits:</span> {study.credit_value}</div>}
            {study.building && <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span className="font-medium">Location:</span> {study.building} {study.room_number}</div>}
            {study.proctor && <div><span className="font-medium">Proctor:</span> {study.proctor}</div>}
          </div>
          {study.eligibility_criteria && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="font-medium text-yellow-800 mb-1">Eligibility Criteria</p>
              <p className="text-yellow-700 text-sm">{study.eligibility_criteria}</p>
            </div>
          )}
        </Card>

        <Card className="p-8">
          <h2 className="text-xl font-semibold mb-4">Select a Time Slot</h2>
          {study.sessions.length === 0 && (
            <p className="text-gray-500">No sessions scheduled yet. Check back later.</p>
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
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    full ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                    : selected ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {formatDate(session.session_date)} · {formatTime(session.start_time)} – {formatTime(session.end_time)}
                      </p>
                      {session.location && (
                        <p className={`text-sm mt-1 ${selected ? 'text-blue-100' : 'text-gray-500'}`}>
                          {session.location}
                        </p>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${full ? 'text-gray-400' : selected ? 'text-blue-100' : 'text-gray-600'}`}>
                      {full ? 'Full' : `${session.available_spots} spot${session.available_spots !== 1 ? 's' : ''} left`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {regError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {regError}
            </div>
          )}
          <Button
            onClick={handleConfirm}
            disabled={!selectedSession}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Registration
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default StudyDetails;