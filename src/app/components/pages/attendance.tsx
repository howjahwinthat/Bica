import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

type Participant = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "present" | "absent" | "no-show";
};

type Session = {
  id: string;
  studyName: string;
  sessionId: string;
  date: string;
  time: string;
  location: string;
  type: "in-person" | "online";
  maxParticipants: number;
  participants: Participant[];
};

const mockSessions: Session[] = [
  {
    id: "1",
    studyName: "Cognitive Psychology Study 2026",
    sessionId: "SESS-2026-001",
    date: "2026-03-15",
    time: "10:00 AM",
    location: "Psychology Lab 203",
    type: "in-person",
    maxParticipants: 10,
    participants: [
      { id: "1", name: "John Smith", email: "john@example.com", status: "pending" },
      { id: "2", name: "Jane Doe", email: "jane@example.com", status: "pending" },
      { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "pending" },
    ],
  },
  {
    id: "2",
    studyName: "Social Behavior Research",
    sessionId: "SESS-2026-002",
    date: "2026-03-16",
    time: "2:00 PM",
    location: "Zoom Meeting Room",
    type: "online",
    maxParticipants: 15,
    participants: [
      { id: "4", name: "Alice Williams", email: "alice@example.com", status: "pending" },
      { id: "5", name: "Charlie Brown", email: "charlie@example.com", status: "pending" },
    ],
  },
];

export function Attendance() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(mockSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const handleMarkAttendance = (sessionId: string, participantId: string, status: Participant["status"]) => {
    setSessions(
      sessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            participants: session.participants.map((p) =>
              p.id === participantId ? { ...p, status } : p
            ),
          };
        }
        return session;
      })
    );

    if (selectedSession) {
      setSelectedSession({
        ...selectedSession,
        participants: selectedSession.participants.map((p) =>
          p.id === participantId ? { ...p, status } : p
        ),
      });
    }

    toast.success(`Attendance marked: ${status}`);
  };

  const handleMarkAllPresent = () => {
    if (!selectedSession) return;

    setSessions(
      sessions.map((session) => {
        if (session.id === selectedSession.id) {
          return {
            ...session,
            participants: session.participants.map((p) => ({ ...p, status: "present" as const })),
          };
        }
        return session;
      })
    );

    setSelectedSession({
      ...selectedSession,
      participants: selectedSession.participants.map((p) => ({ ...p, status: "present" as const })),
    });

    toast.success("All participants marked as present");
  };

  const getStatusBadge = (status: Participant["status"]) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-700">Present</Badge>;
      case "absent":
        return <Badge className="bg-yellow-100 text-yellow-700">Absent (Excused)</Badge>;
      case "no-show":
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getSessionStats = (session: Session) => {
    const present = session.participants.filter((p) => p.status === "present").length;
    const noShow = session.participants.filter((p) => p.status === "no-show").length;
    const pending = session.participants.filter((p) => p.status === "pending").length;
    return { present, noShow, pending };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Mark Attendance</h1>

          {!selectedSession ? (
            <>
              <p className="text-gray-600 mb-6">Select a session to mark attendance</p>
              <div className="space-y-4">
                {sessions.map((session) => {
                  const stats = getSessionStats(session);
                  return (
                    <div key={session.id} className="border p-4 rounded">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{session.studyName}</h3>
                          <p className="text-sm text-gray-600">
                            Session: {session.sessionId} • {session.date} at {session.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.type === "in-person" ? "📍" : "💻"} {session.location}
                          </p>
                        </div>
                        <Badge variant={session.type === "in-person" ? "default" : "secondary"}>
                          {session.type}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <span className="text-gray-600">
                          ✓ Present: <strong>{stats.present}</strong>
                        </span>
                        <span className="text-gray-600">
                          ⏳ Pending: <strong>{stats.pending}</strong>
                        </span>
                        <span className="text-gray-600">
                          ✗ No Show: <strong>{stats.noShow}</strong>
                        </span>
                      </div>

                      <Button onClick={() => setSelectedSession(session)}>
                        Mark Attendance
                      </Button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <Button variant="outline" onClick={() => setSelectedSession(null)} className="mb-4">
                  ← Back to Sessions
                </Button>

                <div className="border p-4 rounded mb-4 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2">{selectedSession.studyName}</h3>
                  <p className="text-sm text-gray-600">
                    Session: {selectedSession.sessionId} • {selectedSession.date} at {selectedSession.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedSession.type === "in-person" ? "📍 In-Person:" : "💻 Online:"}{" "}
                    {selectedSession.location}
                  </p>
                </div>

                <div className="flex justify-end mb-4">
                  <Button onClick={handleMarkAllPresent} variant="outline">
                    Mark All Present
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold mb-3">
                  Participants ({selectedSession.participants.length})
                </h3>
                {selectedSession.participants.map((participant) => (
                  <div key={participant.id} className="border p-4 rounded">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{participant.name}</h4>
                        <p className="text-sm text-gray-600">{participant.email}</p>
                      </div>
                      {getStatusBadge(participant.status)}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleMarkAttendance(selectedSession.id, participant.id, "present")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAttendance(selectedSession.id, participant.id, "absent")}
                      >
                        <Clock size={14} className="mr-1" />
                        Absent (Excused)
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleMarkAttendance(selectedSession.id, participant.id, "no-show")}
                      >
                        <XCircle size={14} className="mr-1" />
                        No Show
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

