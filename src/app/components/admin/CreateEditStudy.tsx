import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft } from "lucide-react";

interface TimeslotData {
  room_id: number;
  start_datetime: string;
  end_datetime: string;
}

interface StudyData {
  title: string;
  description: string;
  credit_value: number;
  max_participants: number;
  status: "Open" | "Closed";
  timeslots: TimeslotData[];
}

const hardcodedRooms = [
  { id: 1, name: "Room A" },
  { id: 2, name: "Room B" },
  { id: 3, name: "Room C" },
];

const CreateEditStudy: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [studyData, setStudyData] = useState<StudyData>({
    title: "",
    description: "",
    credit_value: 1,
    max_participants: 1,
    status: "Open",
    timeslots: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // redirect non-admins
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudyData(prev => ({
      ...prev,
      [name]:
        name === "credit_value" || name === "max_participants"
          ? Number(value)
          : value,
    }));
  };

  // Timeslot helpers
  const addTimeslot = () => {
    setStudyData(prev => ({
      ...prev,
      timeslots: [...prev.timeslots, { room_id: 0, start_datetime: "", end_datetime: "" }],
    }));
  };

  const updateTimeslot = (idx: number, updated: TimeslotData) => {
    setStudyData(prev => {
      const slots = [...prev.timeslots];
      slots[idx] = updated;
      return { ...prev, timeslots: slots };
    });
  };

  const removeTimeslot = (idx: number) => {
    setStudyData(prev => ({
      ...prev,
      timeslots: prev.timeslots.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { ...studyData, researcher_id: user?.id };
      const res = await fetch(
        `http://localhost:3000/api/studies${id ? `/${id}` : ""}`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save study");
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">
            {id ? "Edit Study" : "Create New Study"}
          </h1>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Study fields */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={studyData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={studyData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="credit_value">Credits</Label>
              <Input
                id="credit_value"
                name="credit_value"
                type="number"
                min={1}
                value={studyData.credit_value}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                name="max_participants"
                type="number"
                min={1}
                value={studyData.max_participants}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={studyData.status}
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Timeslots */}
            <hr className="my-6" />
            <h2 className="text-xl mb-2">Timeslots</h2>
            {studyData.timeslots.map((slot, idx) => (
              <div key={idx} className="border p-4 mb-4 rounded space-y-2">
                <div>
                  <Label>Room</Label>
                  <select
                    value={slot.room_id || ""}
                    onChange={e =>
                      updateTimeslot(idx, { ...slot, room_id: Number(e.target.value) })
                    }
                    className="block w-full mt-1 p-2 border rounded"
                    required
                  >
                    <option value="">Select Room</option>
                    {hardcodedRooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Start Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={slot.start_datetime}
                    onChange={e =>
                      updateTimeslot(idx, { ...slot, start_datetime: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>End Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={slot.end_datetime}
                    onChange={e =>
                      updateTimeslot(idx, { ...slot, end_datetime: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => removeTimeslot(idx)}
                >
                  Remove Timeslot
                </Button>
              </div>
            ))}

            <Button type="button" onClick={addTimeslot}>
              Add Timeslot
            </Button>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? (id ? "Updating..." : "Creating...") : id ? "Update Study" : "Create Study"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEditStudy;
