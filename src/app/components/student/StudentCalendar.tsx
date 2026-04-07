import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/app/context/AuthContext';
import { ChevronLeft, ChevronRight, ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';

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
    return signups.filter(s => s.session_date && s.session_date.split('T')[0] === dateStr);
  };

  const selectedDaySignups = selectedDay
    ? signups.filter(s => s.session_date && s.session_date.split('T')[0] === selectedDay)
    : [];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!user || user.role !== 'student') return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>

      {/* Header */}
      <header style={{ backgroundColor: '#003580' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(192,192,192,0.3)' }}>
              <span className="text-white font-bold">B</span>
            </div>
            <div>
              <span className="text-white font-bold">BICA+</span>
              <span className="text-blue-200 text-xs ml-2">Student Portal</span>
            </div>
          </div>
          <Link to="/student/dashboard">
            <button className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Study Schedule</h1>
            <p className="text-blue-200 text-sm">View your registered research sessions</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-0 shadow-sm">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:shadow-sm"
                  style={{ backgroundColor: '#EBF0FA', color: '#003580' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold" style={{ color: '#003580' }}>{monthName}</h2>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:shadow-sm"
                  style={{ backgroundColor: '#EBF0FA', color: '#003580' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {days.map(d => (
                  <div key={d} className="text-center text-xs font-bold uppercase tracking-wide py-2" style={{ color: '#6B7280' }}>{d}</div>
                ))}
              </div>

              {/* Days Grid */}
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
                  const hasEvents = daySignups.length > 0;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                      className="min-h-[64px] p-1.5 rounded-xl text-left transition-all"
                      style={{
                        backgroundColor: isSelected ? '#003580' : isToday ? '#EBF0FA' : hasEvents ? '#F0FDF4' : 'white',
                        border: `2px solid ${isSelected ? '#003580' : isToday ? '#003580' : hasEvents ? '#86EFAC' : '#F3F4F6'}`,
                      }}
                    >
                      <span className={`text-sm font-bold ${isSelected ? 'text-white' : isToday ? '' : 'text-gray-700'}`}
                        style={isToday && !isSelected ? { color: '#003580' } : {}}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {daySignups.slice(0, 2).map(s => (
                          <div key={s.signup_id}
                            className="text-xs rounded px-1 truncate font-medium"
                            style={{
                              backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#DCFCE7',
                              color: isSelected ? 'white' : '#166534'
                            }}>
                            {s.study_title}
                          </div>
                        ))}
                        {daySignups.length > 2 && (
                          <div className={`text-xs ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                            +{daySignups.length - 2} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EBF0FA', border: '2px solid #003580' }} />
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F0FDF4', border: '2px solid #86EFAC' }} />
                <span className="text-xs text-gray-500">Has sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#003580' }} />
                <span className="text-xs text-gray-500">Selected</span>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Card className="p-5 border-0 shadow-sm">
              <h3 className="font-bold mb-1" style={{ color: '#003580' }}>
                {selectedDay
                  ? new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Select a Day'}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {selectedDay ? 'Your registered sessions' : 'Click on a date to view sessions'}
              </p>

              {loading && (
                <p className="text-gray-400 text-sm text-center py-4">Loading your schedule...</p>
              )}

              {!loading && !selectedDay && (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: '#C0C0C0' }} />
                  <p className="text-gray-400 text-sm">Click any date to see your sessions for that day.</p>
                </div>
              )}

              {!loading && selectedDay && selectedDaySignups.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No sessions on this day.</p>
                </div>
              )}

              <div className="space-y-3">
                {selectedDaySignups.map(signup => (
                  <div key={signup.signup_id} className="rounded-xl p-4" style={{ backgroundColor: '#EBF0FA' }}>
                    <p className="font-bold text-sm mb-2" style={{ color: '#003580' }}>{signup.study_title}</p>
                    {signup.start_time && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(signup.start_time)} – {formatTime(signup.end_time)}
                      </div>
                    )}
                    {signup.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3" />
                        {signup.location}
                      </div>
                    )}
                    <Badge className="text-xs font-semibold" style={{ backgroundColor: '#003580', color: 'white', border: 'none' }}>
                      {signup.credit_value} Credits
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Summary Card */}
            <Card className="p-5 border-0 shadow-sm">
              <h3 className="font-bold mb-3" style={{ color: '#003580' }}>Schedule Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total registrations</span>
                  <span className="font-bold" style={{ color: '#003580' }}>{signups.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">This month</span>
                  <span className="font-bold" style={{ color: '#003580' }}>
                    {signups.filter(s => {
                      if (!s.session_date) return false;
                      const d = new Date(s.session_date);
                      return d.getMonth() === month && d.getFullYear() === year;
                    }).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}