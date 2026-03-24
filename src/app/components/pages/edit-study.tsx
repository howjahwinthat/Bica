import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Study = {
  study_id: number;
  title: string;
  description: string;
  researcher_id: number | null;
  credit_value: number | null;
  max_participants: number | null;
  status: string;
  created_at: string;
};

export function EditStudy() {
  const { studyId } = useParams();
  const navigate = useNavigate();

  const [studies, setStudies] = useState<Study[]>([]);
  const [study, setStudy] = useState<Study | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studyId) {
      const fetchStudies = async () => {
        try {
          const res = await fetch("http://localhost:3600/api/studies");
          if (res.ok) {
            const data = await res.json();
            setStudies(data);
          }
        } catch (err) {
          toast.error("Failed to load studies");
        } finally {
          setLoading(false);
        }
      };
      fetchStudies();
    } else {
      const fetchStudy = async () => {
        try {
          const res = await fetch(`http://localhost:3600/api/studies/${studyId}`);
          if (!res.ok) throw new Error("Study not found");
          const data = await res.json();
          setStudy(data);
        } catch (err) {
          toast.error("Failed to load study");
          setStudy(null);
        } finally {
          setLoading(false);
        }
      };
      fetchStudy();
    }
  }, [studyId]);

  const handleDelete = async (study_id: number) => {
    if (!window.confirm("Are you sure you want to delete this study?")) return;
    try {
      const res = await fetch(`http://localhost:3600/api/studies/${study_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Study deleted");
      setStudies(studies.filter((s) => s.study_id !== study_id));
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleSave = async () => {
    if (!study) return;
    try {
      const res = await fetch(`http://localhost:3600/api/studies/${study.study_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(study),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Study updated successfully");
      navigate("/edit-study");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  // LIST VIEW — no studyId in URL
  if (!studyId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="link" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="p-8">
            <h1 className="text-2xl font-semibold mb-6">All Studies</h1>

            {studies.length === 0 ? (
              <p className="text-gray-500">No studies found. Create one first.</p>
            ) : (
              <div className="divide-y">
                {studies.map((s) => (
                  <div key={s.study_id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-sm text-gray-500">{s.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => navigate(`/edit-study/${s.study_id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(s.study_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // EDIT VIEW — studyId in URL
  if (!study) return <div className="p-6">Study not found.</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/edit-study")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
            Back to Studies
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Edit Study</h1>

          <div className="mb-4">
            <Badge>{study.status}</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={study.title || ""}
                onChange={(e) => setStudy({ ...study, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                className="w-full p-2 border rounded min-h-[120px]"
                value={study.description || ""}
                onChange={(e) => setStudy({ ...study, description: e.target.value })}
              />
            </div>

            <div>
              <Label>Credit Value</Label>
              <Input
                type="number"
                step="1"
                value={study.credit_value ?? ""}
                onChange={(e) =>
                  setStudy({ ...study, credit_value: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Max Participants</Label>
              <Input
                type="number"
                value={study.max_participants ?? ""}
                onChange={(e) =>
                  setStudy({ ...study, max_participants: Number(e.target.value) })
                }
              />
            </div>

            <Button onClick={handleSave} className="w-full mt-6">
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}