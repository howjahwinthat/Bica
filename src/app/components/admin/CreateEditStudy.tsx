import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowLeft } from "lucide-react";

interface StudyData {
  title: string;
  description: string;
  location: string;
  room: string;
  duration: string;
  credits: number;
  status: "Open" | "Closed";
}

const CreateEditStudy: React.FC = () => {
  const { id } = useParams(); // for editing existing study
  const navigate = useNavigate();
  const { user } = useAuth();

  const [studyData, setStudyData] = useState<StudyData>({
    title: "",
    description: "",
    location: "",
    room: "",
    duration: "",
    credits: 1,
    status: "Open",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  // Load existing study if editing
  useEffect(() => {
    if (id) {
      // Fetch study data from backend
      fetch(`http://localhost:3000/api/studies/${id}`)
        .then((res) => res.json())
        .then((data) => setStudyData(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudyData({ ...studyData, [name]: name === "credits" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/studies${id ? `/${id}` : ""}`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studyData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save study");
      }

      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">{id ? "Edit Study" : "Create New Study"}</h1>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={studyData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                name="room"
                value={studyData.room}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={studyData.duration}
                onChange={handleChange}
                placeholder="e.g., 1h 30m"
                required
              />
            </div>

            <div>
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                min={1}
                value={studyData.credits}
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
                onChange={(e) =>
                  setStudyData({ ...studyData, status: e.target.value as "Open" | "Closed" })
                }
                className="block w-full mt-1 p-2 border rounded"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

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