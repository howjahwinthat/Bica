import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

type Study = {
  study_id: number;
  title: string;
  description: string | null;
  proctor: string | null;
  department: string | null;
  study_type: string | null;
  duration: number | null;
  credit_value: number | null;
  max_participants: number | null;
  eligibility_criteria: string | null;
  status: string | null;
  created_at: string;
  is_open: boolean;
  building: string | null;
  room_number: string | null;
};

export function SessionManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRA = user?.role === "researcher";

  const [studies, setStudies] = useState<Study[]>([]);
  const [loadingStudies, setLoadingStudies] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch("http://localhost:3600/api/studies");
        if (res.ok) {
          const data = await res.json();
          setStudies(data.filter((s: Study) => s.status === "active"));
        } else {
          toast.error("Failed to load studies");
        }
      } catch (err) {
        toast.error("Could not connect to server");
      } finally {
        setLoadingStudies(false);
      }
    };
    fetchStudies();
  }, []);

  const handleToggleOpen = async (study: Study) => {
    setTogglingId(study.study_id);
    const newIsOpen = !study.is_open;
    try {
      const res = await fetch(`http://localhost:3600/api/studies/${study.study_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...study, is_open: newIsOpen }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setStudies((prev) =>
        prev.map((s) =>
          s.study_id === study.study_id ? { ...s, is_open: newIsOpen } : s
        )
      );
      toast.success(`Study marked as ${newIsOpen ? "Open" : "Closed"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update study");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate(isRA ? "/ra/dashboard" : "/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Session Management</h1>

          {loadingStudies ? (
            <p className="text-gray-500 text-center py-12">Loading studies...</p>
          ) : studies.length === 0 ? (
            <p className="text-gray-600 text-center py-12">
              No approved studies yet. Approve studies from the Study Approval page first.
            </p>
          ) : (
            <div className="space-y-4">
              {studies.map((study) => (
                <div key={study.study_id} className="border p-4 rounded bg-white">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-semibold">{study.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          study.is_open
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-red-100 text-red-700 border-red-300"
                        }
                        variant="outline"
                      >
                        {study.is_open ? "Open" : "Closed"}
                      </Badge>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>

                  {study.proctor && (
                    <p className="text-sm text-gray-500 mb-2">Proctor: {study.proctor}</p>
                  )}

                  {study.description && (
                    <p className="text-sm text-gray-600 mb-3">{study.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    {study.department && (
                      <div><span className="font-medium">Department:</span> {study.department}</div>
                    )}
                    {study.study_type && (
                      <div><span className="font-medium">Type:</span> {study.study_type}</div>
                    )}
                    {study.duration && (
                      <div><span className="font-medium">Duration:</span> {study.duration} min</div>
                    )}
                    {study.credit_value && (
                      <div><span className="font-medium">Credits:</span> {study.credit_value}</div>
                    )}
                    {study.max_participants && (
                      <div><span className="font-medium">Max Participants:</span> {study.max_participants}</div>
                    )}
                    {study.building && (
                      <div><span className="font-medium">Building:</span> {study.building}</div>
                    )}
                    {study.room_number && (
                      <div><span className="font-medium">Room:</span> {study.room_number}</div>
                    )}
                    {study.eligibility_criteria && (
                      <div className="col-span-2">
                        <span className="font-medium">Eligibility:</span> {study.eligibility_criteria}
                      </div>
                    )}
                    <div><span className="font-medium">Study ID:</span> {study.study_id}</div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(study.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleToggleOpen(study)}
                    disabled={togglingId === study.study_id}
                    className={
                      study.is_open
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }
                  >
                    {togglingId === study.study_id
                      ? "Updating..."
                      : study.is_open
                      ? "Close Study"
                      : "Open Study"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}