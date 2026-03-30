import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const navigate = useNavigate();
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
            studySessions.forEach((s: any) => {
              allSessions.push({
                ...s,
                study_title: study.title,
                study_type: study.study_type,
              });
            });
          }
        }
        setSessions(allSessions);
      } catch (err) {
        toast.error("Could not load sessions");
      } finally {
        setLoading(false);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        <h1 className="text-2xl font-semibold mb-6">Study Calendar</h1>

        <div className="grid lg:grid-cols-3 gap-6">
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
                  const daySessions = getSessionsForDay(day);
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
                        {daySessions.slice(0, 2).map(s => (
                          <div key={s.session_id} className="text-xs bg-blue-100 text-blue-700 rounded px-1 truncate">
                            {s.study_title}
                          </div>
                        ))}
                        {daySessions.length > 2 && (
                          <div className="text-xs text-gray-500">+{daySessions.length - 2} more</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">
                {selectedDay
                  ? new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Select a day'}
              </h3>

              {loading && <p className="text-gray-500 text-sm">Loading...</p>}

              {!loading && !selectedDay && (
                <p className="text-gray-500 text-sm">Click a day to see sessions.</p>
              )}

              {!loading && selectedDay && selectedDaySessions.length === 0 && (
                <p className="text-gray-500 text-sm">No sessions on this day.</p>
              )}

              <div className="space-y-3">
                {selectedDaySessions.map(session => (
                  <div key={session.session_id} className="border rounded-lg p-3">
                    <p className="font-medium text-sm">{session.study_title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(session.start_time)} – {formatTime(session.end_time)}
                    </p>
                    {session.location && (
                      <p className="text-xs text-gray-500">{session.location}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <Badge className="text-xs bg-blue-100 text-blue-700">
                        {session.available_spots} spots left
                      </Badge>
                      {session.study_type && (
                        <Badge className="text-xs bg-purple-100 text-purple-700">
                          {session.study_type}
                        </Badge>
                      )}
                    </div>
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