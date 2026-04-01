import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

type Participant = {
  signup_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  signed_up_at: string;
};

type Study = {
  study_id: number;
  title: string;
  status: string | null;
  participants: Participant[];
};

export function RAParticipants() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedStudy, setExpandedStudy] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchStudiesWithParticipants();
  }, []);

  const fetchStudiesWithParticipants = async () => {
    try {
      const res = await fetch("http://localhost:3600/api/studies");
      if (!res.ok) throw new Error("Failed to load studies");
      const data = await res.json();
      const activeStudies = data.filter((s: any) => s.status === "active");
      const studiesWithParticipants = await Promise.all(
        activeStudies.map(async (study: any) => {
          const pRes = await fetch(`http://localhost:3600/api/signups/study/${study.study_id}`);
          const participants = pRes.ok ? await pRes.json() : [];
          return { ...study, participants };
        })
      );
      setStudies(studiesWithParticipants);
    } catch (err) {
      toast.error("Failed to load studies");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (signupId: number, newStatus: string) => {
    setUpdatingId(signupId);
    try {
      const res = await fetch(`http://localhost:3600/api/signups/${signupId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(
        newStatus === "attended"
          ? "Marked as attended — credits awarded!"
          : newStatus === "registered"
          ? "Credits removed — status reset to registered"
          : "Status updated"
      );
      await fetchStudiesWithParticipants();
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300" variant="outline">Registered</Badge>;
      case "attended":
        return <Badge className="bg-green-100 text-green-700 border-green-300" variant="outline">Attended</Badge>;
      case "no_show":
        return <Badge className="bg-red-100 text-red-700 border-red-300" variant="outline">No Show</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300" variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredStudies = studies.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalParticipants = studies.reduce(
    (sum, s) => sum + s.participants.filter((p) => p.status !== "cancelled").length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/ra/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold">My Participants</h1>
            <Badge className="bg-teal-100 text-teal-700 border-teal-300" variant="outline">
              {totalParticipants} total
            </Badge>
          </div>
          <p className="text-gray-500 text-sm mb-6">Students signed up for your active studies</p>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search studies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 p-2 border rounded"
            />
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading...</p>
          ) : filteredStudies.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No active studies found.</p>
          ) : (
            <div className="space-y-4">
              {filteredStudies.map((study) => {
                const activeParticipants = study.participants.filter((p) => p.status !== "cancelled");
                const isExpanded = expandedStudy === study.study_id;

                return (
                  <div key={study.study_id} className="border rounded-lg bg-white overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedStudy(isExpanded ? null : study.study_id)}
                    >
                      <div className="text-left">
                        <p className="font-semibold">{study.title}</p>
                        <p className="text-sm text-gray-500">
                          {activeParticipants.length} participant{activeParticipants.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </button>

                    {isExpanded && (
                      <div className="border-t">
                        {study.participants.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-6">No participants yet.</p>
                        ) : (
                          <div className="divide-y">
                            {study.participants.map((p) => (
                              <div key={p.signup_id} className="p-4 flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{p.first_name} {p.last_name}</p>
                                  <p className="text-sm text-gray-500">{p.email}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Signed up {new Date(p.signed_up_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {getStatusBadge(p.status)}
                                  <div className="flex gap-1">
                                    {p.status === "registered" && (
                                      <>
                                        <Button
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                          disabled={updatingId === p.signup_id}
                                          onClick={() => handleUpdateStatus(p.signup_id, "attended")}
                                        >
                                          Attended
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          className="text-xs"
                                          disabled={updatingId === p.signup_id}
                                          onClick={() => handleUpdateStatus(p.signup_id, "no_show")}
                                        >
                                          No Show
                                        </Button>
                                      </>
                                    )}
                                    {p.status === "attended" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                                        disabled={updatingId === p.signup_id}
                                        onClick={() => handleUpdateStatus(p.signup_id, "registered")}
                                      >
                                        Remove Credits
                                      </Button>
                                    )}
                                    {p.status === "no_show" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                                        disabled={updatingId === p.signup_id}
                                        onClick={() => handleUpdateStatus(p.signup_id, "registered")}
                                      >
                                        Reset
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}