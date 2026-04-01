import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

type Study = {
  study_id: number;
  title: string;
  description: string;
  eligibility_criteria: string;
  proctor: string;
  department: string;
  study_type: string;
  duration: string;
  researcher_id: number | null;
  credit_value: number | null;
  max_participants: number | null;
  status: string;
  created_at: string;
  is_active: boolean;
  requires_prescreen: boolean;
};

export function EditStudy() {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRA = user?.role === "researcher";

  const editStudyPath = isRA ? "/ra/edit-study" : "/edit-study";
  const dashboardPath = isRA ? "/ra/dashboard" : "/dashboard";

  const [studies, setStudies] = useState<Study[]>([]);
  const [study, setStudy] = useState<Study | null>(null);
  const [loading, setLoading] = useState(true);

  // Search and filter state
  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCredits, setFilterCredits] = useState("");

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
      navigate(editStudyPath);
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  };

  const filteredStudies = studies.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = filterDepartment ? s.department === filterDepartment : true;
    const matchesStatus = filterStatus ? s.status === filterStatus : true;
    const matchesType = filterType ? s.study_type === filterType : true;
    const matchesCredits = filterCredits ? String(s.credit_value) === filterCredits : true;
    return matchesSearch && matchesDepartment && matchesStatus && matchesType && matchesCredits;
  });

  if (loading) return <div className="p-6">Loading...</div>;

  // LIST VIEW
  if (!studyId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="link" onClick={() => navigate(dashboardPath)}>
              <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="p-8">
            <h1 className="text-2xl font-semibold mb-6">All Studies</h1>

            {/* Search and Filter */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="p-2 border rounded text-sm"
                >
                  <option value="">All Departments</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Information Science">Information Science</option>
                  <option value="Biology">Biology</option>
                  <option value="Business">Business</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Communication">Communication</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border rounded text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 border rounded text-sm"
                >
                  <option value="">All Types</option>
                  <option value="online">Online</option>
                  <option value="in-person">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <select
                  value={filterCredits}
                  onChange={(e) => setFilterCredits(e.target.value)}
                  className="p-2 border rounded text-sm"
                >
                  <option value="">All Credits</option>
                  <option value="1">1.0</option>
                  <option value="2">2.0</option>
                  <option value="3">3.0</option>
                  <option value="4">4.0</option>
                  <option value="5">5.0</option>
                </select>
              </div>
              {(search || filterDepartment || filterStatus || filterType || filterCredits) && (
                <p className="text-sm text-gray-500">
                  Showing {filteredStudies.length} of {studies.length} studies
                  <button
                    className="ml-2 text-blue-600 hover:underline"
                    onClick={() => { setSearch(""); setFilterDepartment(""); setFilterStatus(""); setFilterType(""); setFilterCredits(""); }}
                  >
                    Clear filters
                  </button>
                </p>
              )}
            </div>

            {filteredStudies.length === 0 ? (
              <p className="text-gray-500">No studies match your search.</p>
            ) : (
              <div className="divide-y">
                {filteredStudies.map((s) => (
                  <div key={s.study_id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm text-gray-500">{s.status}</span>
                        {s.department && <span className="text-sm text-gray-400">• {s.department}</span>}
                        {s.study_type && <span className="text-sm text-gray-400">• {s.study_type}</span>}
                        {s.credit_value && <span className="text-sm text-gray-400">• {s.credit_value} credits</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => navigate(`${editStudyPath}/${s.study_id}`)}
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

  // EDIT VIEW
  if (!study) return <div className="p-6">Study not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate(editStudyPath)}>
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
              <Label>Study Name *</Label>
              <Input
                value={study.title || ""}
                onChange={(e) => setStudy({ ...study, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Proctor</Label>
              <Input
                value={study.proctor || ""}
                onChange={(e) => setStudy({ ...study, proctor: e.target.value })}
              />
            </div>

            <div>
              <Label>Department</Label>
              <select
                className="block w-full mt-1 p-2 border rounded"
                value={study.department || ""}
                onChange={(e) => setStudy({ ...study, department: e.target.value })}
              >
                <option value="">Select department</option>
                <option value="Psychology">Psychology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Information Science">Information Science</option>
                <option value="Biology">Biology</option>
                <option value="Business">Business</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Accounting">Accounting</option>
                <option value="Communication">Communication</option>
              </select>
            </div>

            <div>
              <Label>Study Type</Label>
              <select
                className="block w-full mt-1 p-2 border rounded"
                value={study.study_type || ""}
                onChange={(e) => setStudy({ ...study, study_type: e.target.value })}
              >
                <option value="">Select type</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <Label>Duration</Label>
              <select
                className="block w-full mt-1 p-2 border rounded"
                value={study.duration || ""}
                onChange={(e) => setStudy({ ...study, duration: e.target.value })}
              >
                <option value="">Select duration</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </div>

            <div>
              <Label>Credits</Label>
              <select
                className="block w-full mt-1 p-2 border rounded"
                value={study.credit_value ?? ""}
                onChange={(e) => setStudy({ ...study, credit_value: Number(e.target.value) })}
              >
                <option value="">Select credits</option>
                <option value="1">1.0</option>
                <option value="2">2.0</option>
                <option value="3">3.0</option>
                <option value="4">4.0</option>
                <option value="5">5.0</option>
              </select>
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

            <div>
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={study.description || ""}
                onChange={(e) => setStudy({ ...study, description: e.target.value })}
              />
            </div>

            <div>
              <Label>Eligibility Criteria</Label>
              <Textarea
                rows={3}
                value={study.eligibility_criteria || ""}
                onChange={(e) => setStudy({ ...study, eligibility_criteria: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={study.is_active ?? true}
                onChange={(e) => setStudy({ ...study, is_active: e.target.checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="requires_prescreen"
                checked={study.requires_prescreen ?? false}
                onChange={(e) => setStudy({ ...study, requires_prescreen: e.target.checked })}
              />
              <Label htmlFor="requires_prescreen">Requires Prescreen</Label>
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