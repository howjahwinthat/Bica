import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Session {
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
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'TBD';
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

const TimeslotList: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSessions();
  }, []);

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
      // Sort by date
      allSessions.sort((a, b) => a.session_date.localeCompare(b.session_date));
      setSessions(allSessions);
    } catch (err) {
      toast.error("Failed to load timeslots");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: number) => {
    if (!window.confirm("Delete this timeslot?")) return;
    try {
      const res = await fetch(`http://localhost:3600/api/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSessions(sessions.filter(s => s.session_id !== sessionId));
      toast.success("Timeslot deleted");
    } catch (err) {
      toast.error("Failed to delete timeslot");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">All Timeslots</h1>

        {loading && <p className="text-gray-500">Loading timeslots...</p>}

        {!loading && sessions.length === 0 && (
          <Card className="p-8 text-center text-gray-500">
            No timeslots found. Create a study with time slots first.
          </Card>
        )}

        {!loading && sessions.length > 0 && (
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Study</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Capacity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Spots Left</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.session_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium">{session.study_title}</p>
                        {session.study_type && (
                          <Badge className="text-xs bg-purple-100 text-purple-700 mt-1">
                            {session.study_type}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">{formatDate(session.session_date)}</td>
                      <td className="py-3 px-4">
                        {formatTime(session.start_time)} – {formatTime(session.end_time)}
                      </td>
                      <td className="py-3 px-4">{session.location || 'TBD'}</td>
                      <td className="py-3 px-4">{session.capacity}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-xs ${session.available_spots <= 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {session.available_spots <= 0 ? 'Full' : `${session.available_spots} left`}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(session.session_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TimeslotList;