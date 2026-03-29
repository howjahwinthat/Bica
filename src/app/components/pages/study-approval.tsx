import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Study = {
  study_id: number;
  title: string;
  proctor: string | null;
  department: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
  credit_value: number | null;
  study_type: string | null;
  duration: number | null;
};

export function StudyApproval() {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch("http://localhost:3600/api/studies");
        if (res.ok) {
          const data = await res.json();
          setStudies(data);
        } else {
          toast.error("Failed to load studies");
        }
      } catch (err) {
        toast.error("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchStudies();
  }, []);

  const handleUpdateStatus = async (study: Study, newStatus: "active" | "closed") => {
    setProcessingId(study.study_id);
    try {
      const res = await fetch(`http://localhost:3600/api/studies/${study.study_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: study.title,
          description: study.description,
          proctor: study.proctor,
          department: study.department,
          study_type: study.study_type,
          duration: study.duration,
          credit_value: study.credit_value,
          eligibility_criteria: null,
          status: newStatus,
          is_active: true,
          requires_prescreen: false,
          is_open: false,
        }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setStudies((prev) =>
        prev.map((s) =>
          s.study_id === study.study_id ? { ...s, status: newStatus } : s
        )
      );
      toast.success(
        newStatus === "active"
          ? `"${study.title}" has been approved!`
          : `"${study.title}" has been closed`
      );
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingStudies = studies.filter((s) => s.status === "draft" || !s.status);
  const reviewedStudies = studies.filter((s) => s.status === "active" || s.status === "closed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-2">Study Approval Requests</h1>
          <p className="text-sm text-gray-500 mb-6">
            {pendingStudies.length} pending • {reviewedStudies.length} reviewed
          </p>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading studies...</p>
          ) : (
            <div className="space-y-6">
              {pendingStudies.length === 0 && (
                <p className="text-gray-600 text-center py-8">No pending approval requests</p>
              )}

              {pendingStudies.map((study) => (
                <div key={study.study_id} className="border p-4 rounded bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{study.title}</h3>
                      <p className="text-sm text-gray-600">
                        {study.proctor && <span>{study.proctor}</span>}
                        {study.proctor && study.department && <span> • </span>}
                        {study.department && <span>{study.department}</span>}
                      </p>
                    </div>
                    <Badge variant="secondary">Draft</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    {study.study_type && (
                      <div><span className="font-medium">Type:</span> {study.study_type}</div>
                    )}
                    {study.duration && (
                      <div><span className="font-medium">Duration:</span> {study.duration} min</div>
                    )}
                    {study.credit_value && (
                      <div><span className="font-medium">Credits:</span> {study.credit_value}</div>
                    )}
                    <div>
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(study.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {study.description && (
                    <p className="text-gray-700 mb-3 text-sm">{study.description}</p>
                  )}

                  <div className="mb-3">
                    <Label htmlFor={`notes-${study.study_id}`}>Review Notes</Label>
                    <Textarea
                      id={`notes-${study.study_id}`}
                      value={reviewNotes[study.study_id] || ""}
                      onChange={(e) =>
                        setReviewNotes({ ...reviewNotes, [study.study_id]: e.target.value })
                      }
                      placeholder="Add notes or feedback..."
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleUpdateStatus(study, "active")}
                      disabled={processingId === study.study_id}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {processingId === study.study_id ? "Processing..." : "Approve"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateStatus(study, "closed")}
                      disabled={processingId === study.study_id}
                      className="flex-1"
                    >
                      {processingId === study.study_id ? "Processing..." : "Reject"}
                    </Button>
                  </div>
                </div>
              ))}

              {reviewedStudies.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold text-gray-700 mt-8 mb-2">Previously Reviewed</h2>
                  {reviewedStudies.map((study) => (
                    <div key={study.study_id} className="border p-4 rounded bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{study.title}</h3>
                          <p className="text-sm text-gray-600">
                            {study.proctor && <span>{study.proctor}</span>}
                            {study.proctor && study.department && <span> • </span>}
                            {study.department && <span>{study.department}</span>}
                          </p>
                        </div>
                        <Badge variant={study.status === "active" ? "default" : "destructive"}>
                          {study.status === "active" ? "Approved" : "Rejected"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}