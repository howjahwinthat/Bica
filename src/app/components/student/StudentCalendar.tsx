import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/app/context/AuthContext';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

type Signup = {
  signup_id: number;
  session_id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  study_title: string;
  credit_value: number;
};

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export default function StudentCalendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'student') navigate('/student/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchSignups = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:3600/api/student/${user.id}/signups`);
        if (res.ok) {
          const data = await res.json();
          setSignups(data);
        }
      } catch (err) {
        console.error('Failed to load signups');
      } finally {
        setLoading(false);
      }
    };
    fetchSignups();
  }, [user]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getSignupsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return signups.filter(s => s.session_date.split('T')[0] === dateStr);
  };

  const selectedDaySignups = selectedDay
    ? signups.filter(s => s.session_date.split('T')[0] === selectedDay)
    : [];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!user || user.role !== 'student') return null;

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
          <Link to="/student/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">My Schedule</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold">{monthName}</h2>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {days.map(d => (
                  <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const daySignups = getSignupsForDay(day);
                  const isSelected = selectedDay === dateStr;
                  const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                      className={`min-h-[60px] p-1 rounded-lg border text-left transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50'
                        : isToday ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {daySignups.slice(0, 2).map(s => (
                          <div key={s.signup_id} className="text-xs bg-green-100 text-green-700 rounded px-1 truncate">
                            {s.study_title}
                          </div>
                        ))}
                        {daySignups.length > 2 && (
                          <div className="text-xs text-gray-500">+{daySignups.length - 2} more</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Side panel */}
          <div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">
                {selectedDay
                  ? new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Select a day'}
              </h3>

              {loading && <p className="text-gray-500 text-sm">Loading...</p>}

              {!loading && !selectedDay && (
                <p className="text-gray-500 text-sm">Click a day to see your sessions.</p>
              )}

              {!loading && selectedDay && selectedDaySignups.length === 0 && (
                <p className="text-gray-500 text-sm">No sessions registered on this day.</p>
              )}

              <div className="space-y-3">
                {selectedDaySignups.map(signup => (
                  <div key={signup.signup_id} className="border rounded-lg p-3">
                    <p className="font-medium text-sm">{signup.study_title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(signup.start_time)} – {formatTime(signup.end_time)}
                    </p>
                    {signup.location && (
                      <p className="text-xs text-gray-500">{signup.location}</p>
                    )}
                    <Badge className="text-xs bg-blue-100 text-blue-700 mt-2">
                      {signup.credit_value} Credits
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}