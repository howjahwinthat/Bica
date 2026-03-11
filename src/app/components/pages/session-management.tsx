import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Session = {
  id: string;
  studyName: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  enrolled: number;
  sessionId: string;
};

const mockSessions: Session[] = [
  {
    id: "1",
    studyName: "Cognitive Psychology Study 2026",
    date: "2026-03-15",
    time: "10:00 AM",
    location: "Psychology Lab 203",
    maxParticipants: 10,
    enrolled: 7,
    sessionId: "SESS-2026-001",
  },
  {
    id: "2",
    studyName: "Social Behavior Research",
    date: "2026-03-16",
    time: "11:00 AM",
    location: "Online (Zoom)",
    maxParticipants: 15,
    enrolled: 3,
    sessionId: "SESS-2026-002",
  },
];

export function SessionManagement() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(mockSessions);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSession, setNewSession] = useState({
    studyName: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "10",
  });

  const handleCreateSession = () => {
    if (!newSession.studyName || !newSession.date || !newSession.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    const sessionId = `SESS-2026-${String(sessions.length + 1).padStart(3, "0")}`;

    const session: Session = {
      id: Date.now().toString(),
      studyName: newSession.studyName,
      date: newSession.date,
      time: newSession.time,
      location: newSession.location,
      maxParticipants: parseInt(newSession.maxParticipants),
      enrolled: 0,
      sessionId,
    };

    setSessions([...sessions, session]);
    setShowCreateForm(false);
    setNewSession({
      studyName: "",
      date: "",
      time: "",
      location: "",
      maxParticipants: "10",
    });
    toast.success(`Session created with ID: ${sessionId}`);
  };

  const handleCopySessionId = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId);
    toast.success("Session ID copied to clipboard");
  };

  const handleDeleteSession = (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions(sessions.filter((s) => s.id !== id));
      toast.success("Session deleted");
    }
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Session Management</h1>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? "Cancel" : "Create Session"}
            </Button>
          </div>

          {showCreateForm && (
            <div className="border p-4 rounded mb-6 bg-gray-50">
              <h2 className="text-xl mb-4">Create New Session</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="studyName">Study Name *</Label>
                  <select
                    id="studyName"
                    value={newSession.studyName}
                    onChange={(e) => setNewSession({ ...newSession, studyName: e.target.value })}
                    className="block w-full mt-1 p-2 border rounded"
                  >
                    <option value="">Select a study</option>
                    <option value="Cognitive Psychology Study 2026">Cognitive Psychology Study 2026</option>
                    <option value="Social Behavior Research">Social Behavior Research</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newSession.location}
                    onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                    placeholder="e.g., Psychology Lab 203 or Online (Zoom)"
                  />
                </div>

                <div>
                  <Label htmlFor="maxParticipants">Maximum Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newSession.maxParticipants}
                    onChange={(e) => setNewSession({ ...newSession, maxParticipants: e.target.value })}
                  />
                </div>

                <Button onClick={handleCreateSession} className="w-full">
                  Create Session
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border p-4 rounded">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{session.studyName}</h3>
                    <p className="text-sm text-gray-600">
                      {session.date} at {session.time}
                    </p>
                  </div>
                  <Badge variant={session.enrolled >= session.maxParticipants ? "destructive" : "default"}>
                    {session.enrolled >= session.maxParticipants ? "Full" : "Available"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  Location: {session.location} • Enrolled: {session.enrolled}/{session.maxParticipants}
                </p>

                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Session ID:</span>
                  <code className="text-sm font-mono text-blue-600">{session.sessionId}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopySessionId(session.sessionId)}
                  >
                    Copy
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  Delete Session
                </Button>
              </div>
            ))}

            {sessions.length === 0 && (
              <p className="text-gray-600 text-center py-12">
                No sessions created yet
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
