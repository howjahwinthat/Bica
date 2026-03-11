import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type ApprovalRequest = {
  id: string;
  studyName: string;
  pi: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  description: string;
  department: string;
  irbNumber: string;
};

const mockRequests: ApprovalRequest[] = [
  {
    id: "1",
    studyName: "Social Behavior Research",
    pi: "Dr. John Doe",
    submittedDate: "2026-03-10",
    status: "pending",
    description: "This study investigates social dynamics in group settings using controlled experiments.",
    department: "Sociology",
    irbNumber: "IRB-2026-045",
  },
  {
    id: "2",
    studyName: "Language Processing Study",
    pi: "Dr. Emily Chen",
    submittedDate: "2026-03-09",
    status: "pending",
    description: "Research on how bilinguals process language in different contexts.",
    department: "Linguistics",
    irbNumber: "IRB-2026-046",
  },
];

export function StudyApproval() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(mockRequests);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const handleApprove = (request: ApprovalRequest) => {
    setRequests(
      requests.map((r) =>
        r.id === request.id ? { ...r, status: "approved" as const } : r
      )
    );
    toast.success(`${request.studyName} has been approved!`);
  };

  const handleReject = (request: ApprovalRequest) => {
    setRequests(
      requests.map((r) =>
        r.id === request.id ? { ...r, status: "rejected" as const } : r
      )
    );
    toast.success(`${request.studyName} has been rejected`);
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
          <h1 className="text-2xl font-semibold mb-6">Study Approval Requests</h1>

          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request.id} className="border p-4 rounded">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{request.studyName}</h3>
                    <p className="text-sm text-gray-600">
                      {request.pi} • {request.department}
                    </p>
                  </div>
                  <Badge
                    variant={
                      request.status === "approved"
                        ? "default"
                        : request.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {request.status}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-2">{request.description}</p>
                <p className="text-sm text-gray-600 mb-4">
                  IRB: {request.irbNumber} • Submitted: {request.submittedDate}
                </p>

                {request.status === "pending" && (
                  <>
                    <div className="mb-3">
                      <Label htmlFor={`notes-${request.id}`}>Review Notes</Label>
                      <Textarea
                        id={`notes-${request.id}`}
                        value={reviewNotes[request.id] || ""}
                        onChange={(e) =>
                          setReviewNotes({ ...reviewNotes, [request.id]: e.target.value })
                        }
                        placeholder="Add notes or feedback..."
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(request)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(request)}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {requests.length === 0 && (
              <p className="text-gray-600 text-center py-12">No pending approval requests</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}