import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

type Session = {
  session_id: number;
  study_id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  capacity: number;
  available_spots: number;
  study_title: string;
  study_type: string;
};

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function AdminCalendar() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllSessions = async () => {
      try {
        const res = await fetch("http://localhost:3600/api/studies");
        if (!res.ok) throw new Error("Failed to load studies");
        const studies = await res.json();
        const allSessions: Session[] = [];
        for (const study of studies) {
          const sRes = await fetch(`http://localhost:3600/api/studies/${study.study_id}/sessions`);
          if (sRes.ok) {
            const studySessions = await sRes.json();
            studySessions.forEach((s: any) => allSessions.push({
              ...s, study_title: study.title, study_type: study.study_type,
            }));
          }
        }
        setSessions(allSessions);
      } catch { toast.error("Could not load sessions"); }
      finally { setLoading(false); }
    };
    fetchAllSessions();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getSessionsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sessions.filter(s => s.session_date.split('T')[0] === dateStr);
  };

  const selectedDaySessions = selectedDay
    ? sessions.filter(s => s.session_date.split('T')[0] === selectedDay)
    : [];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Study Calendar</h1>
            <p className="text-blue-200 text-sm">View all scheduled study sessions</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ backgroundColor: '#EBF0FA', color: '#003580' }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold" style={{ color: '#003580' }}>{monthName}</h2>
                <button onClick={nextMonth}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ backgroundColor: '#EBF0FA', color: '#003580' }}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {days.map(d => (
                  <div key={d} className="text-center text-xs font-bold uppercase tracking-wide py-2" style={{ color: '#6B7280' }}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const daySessions = getSessionsForDay(day);
                  const isSelected = selectedDay === dateStr;
                  const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                  const hasEvents = daySessions.length > 0;

                  return (
                    <button key={day} onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                      className="min-h-[64px] p-1.5 rounded-xl text-left transition-all"
                      style={{
                        backgroundColor: isSelected ? '#003580' : isToday ? '#EBF0FA' : hasEvents ? '#F0FDF4' : 'white',
                        border: `2px solid ${isSelected ? '#003580' : isToday ? '#003580' : hasEvents ? '#86EFAC' : '#F3F4F6'}`,
                      }}>
                      <span className="text-sm font-bold" style={{ color: isSelected ? 'white' : isToday ? '#003580' : '#374151' }}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {daySessions.slice(0, 2).map(s => (
                          <div key={s.session_id} className="text-xs rounded px-1 truncate font-medium"
                            style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#DBEAFE', color: isSelected ? 'white' : '#1D4ED8' }}>
                            {s.study_title}
                          </div>
                        ))}
                        {daySessions.length > 2 && (
                          <div className="text-xs" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}>
                            +{daySessions.length - 2} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5 border-0 shadow-sm">
              <h3 className="font-bold mb-1" style={{ color: '#003580' }}>
                {selectedDay
                  ? new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Select a Day'}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {selectedDay ? 'Sessions scheduled' : 'Click a date to view sessions'}
              </p>

              {loading && <p className="text-gray-400 text-sm">Loading...</p>}
              {!loading && !selectedDay && (
                <div className="text-center py-6">
                  <Calendar className="w-10 h-10 mx-auto mb-2" style={{ color: '#C0C0C0' }} />
                  <p className="text-gray-400 text-sm">Select a date to view sessions.</p>
                </div>
              )}
              {!loading && selectedDay && selectedDaySessions.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No sessions on this day.</p>
              )}

              <div className="space-y-3">
                {selectedDaySessions.map(session => (
                  <div key={session.session_id} className="rounded-xl p-4" style={{ backgroundColor: '#EBF0FA' }}>
                    <p className="font-bold text-sm mb-2" style={{ color: '#003580' }}>{session.study_title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(session.start_time)} – {formatTime(session.end_time)}
                    </div>
                    {session.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3" />{session.location}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        session.available_spots <= 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {session.available_spots <= 0 ? 'Full' : `${session.available_spots} spots left`}
                      </span>
                      {session.study_type && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}>
                          {session.study_type}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 border-0 shadow-sm">
              <h3 className="font-bold mb-3" style={{ color: '#003580' }}>Month Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total sessions</span>
                  <span className="font-bold" style={{ color: '#003580' }}>{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">This month</span>
                  <span className="font-bold" style={{ color: '#003580' }}>
                    {sessions.filter(s => {
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