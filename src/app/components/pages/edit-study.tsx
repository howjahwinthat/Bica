import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Mock study data
const mockStudies = [
  {
    id: "1",
    name: "Cognitive Psychology Study 2026",
    pi: "Dr. Jane Smith",
    department: "Psychology",
    status: "active",
    participants: 45,
    credits: 1.0,
    duration: 30,
    type: "Online",
    description: "This study examines cognitive processes in decision-making scenarios.",
  },
  {
    id: "2",
    name: "Social Behavior Research",
    pi: "Dr. John Doe",
    department: "Sociology",
    status: "pending",
    participants: 12,
    credits: 1.5,
    duration: 45,
    type: "In-Person",
    description: "Research on social dynamics in group settings.",
  },
  {
    id: "3",
    name: "Memory Retention Experiment",
    pi: "Dr. Sarah Johnson",
    department: "Psychology",
    status: "active",
    participants: 78,
    credits: 1.0,
    duration: 60,
    type: "Hybrid",
    description: "Testing memory retention across different age groups.",
  },
];

export function EditStudy() {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const [selectedStudy, setSelectedStudy] = useState(studyId ? mockStudies.find(s => s.id === studyId) : null);

  const handleSaveChanges = () => {
    toast.success("Study details updated successfully!");
  };

  const handleDeleteStudy = () => {
    if (confirm("Are you sure you want to delete this study? This action cannot be undone.")) {
      toast.success("Study deleted successfully!");
      setSelectedStudy(null);
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
          <h1 className="text-2xl font-semibold mb-6">Edit Study Details</h1>

          <div className="mb-6">
            <Label htmlFor="selectStudy">Select Study</Label>
            <select
              id="selectStudy"
              className="block w-full mt-1 p-2 border rounded"
              onChange={(e) => setSelectedStudy(mockStudies.find(s => s.id === e.target.value) || null)}
              value={selectedStudy?.id || ""}
            >
              <option value="">Choose a study...</option>
              {mockStudies.map((study) => (
                <option key={study.id} value={study.id}>
                  {study.name} - {study.pi}
                </option>
              ))}
            </select>
          </div>

          {selectedStudy ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <Badge
                  variant={
                    selectedStudy.status === "active"
                      ? "default"
                      : selectedStudy.status === "pending"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {selectedStudy.status}
                </Badge>
                <Button variant="destructive" size="sm" onClick={handleDeleteStudy}>
                  Delete Study
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Study Name</Label>
                  <Input id="name" defaultValue={selectedStudy.name} />
                </div>

                <div>
                  <Label htmlFor="pi">Principal Investigator</Label>
                  <Input id="pi" defaultValue={selectedStudy.pi} />
                </div>

                <div>
                  <Label htmlFor="dept">Department</Label>
                  <Input id="dept" defaultValue={selectedStudy.department} />
                </div>

                <div>
                  <Label htmlFor="type">Study Type</Label>
                  <select className="block w-full mt-1 p-2 border rounded" defaultValue={selectedStudy.type}>
                    <option>Online</option>
                    <option>In-Person</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" type="number" defaultValue={selectedStudy.duration} />
                </div>

                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input id="credits" type="number" step="0.5" defaultValue={selectedStudy.credits} />
                </div>

                <div>
                  <Label htmlFor="description">Study Description</Label>
                  <textarea
                    id="description"
                    className="block w-full mt-1 p-2 border rounded min-h-[120px]"
                    defaultValue={selectedStudy.description}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Study Status</Label>
                  <select className="block w-full mt-1 p-2 border rounded" defaultValue={selectedStudy.status}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending Approval</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <Button onClick={handleSaveChanges} className="w-full mt-6">
                  Save Changes
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center py-12">
              Select a study from the list to edit its details
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
