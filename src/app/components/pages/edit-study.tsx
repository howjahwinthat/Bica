import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Edit3, Search, Trash2, Loader2 } from "lucide-react";
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
  credit_value: number | null;
  max_participants: number | null;
  status: string;
  created_at: string;
  is_active: boolean;
  requires_prescreen: boolean;
  building: string;
  room_number: string;
};

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all";
const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: '#F0FDF4', text: '#166534' },
  draft: { bg: '#FEF3C7', text: '#92400E' },
  closed: { bg: '#FEF2F2', text: '#DC2626' },
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
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  useEffect(() => {
    if (!studyId) {
      fetch("http://localhost:3600/api/studies")
        .then(r => r.json())
        .then(setStudies)
        .catch(() => toast.error("Failed to load studies"))
        .finally(() => setLoading(false));
    } else {
      fetch(`http://localhost:3600/api/studies/${studyId}`)
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(setStudy)
        .catch(() => { toast.error("Failed to load study"); setStudy(null); })
        .finally(() => setLoading(false));
    }
  }, [studyId]);

  const handleDelete = async (study_id: number) => {
    if (!window.confirm("Are you sure you want to delete this study?")) return;
    try {
      const res = await fetch(`http://localhost:3600/api/studies/${study_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Study deleted");
      setStudies(studies.filter(s => s.study_id !== study_id));
    } catch (err: any) { toast.error(err.message || "Delete failed"); }
  };

  const handleSave = async () => {
    if (!study) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3600/api/studies/${study.study_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(study),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Study updated successfully");
      navigate(editStudyPath);
    } catch (err: any) { toast.error(err.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const filteredStudies = studies.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus ? s.status === filterStatus : true) &&
    (filterDepartment ? s.department === filterDepartment : true)
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F6F9' }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#003580' }} />
    </div>
  );

  // LIST VIEW
  if (!studyId) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
        <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Studies</h1>
              <p className="text-blue-200 text-sm">{studies.length} total studies</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-8">
          {/* Filters */}
          <Card className="p-5 border-0 shadow-sm mb-6">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="relative md:col-span-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search studies..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
              <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                <option value="">All Departments</option>
                {["Psychology","Computer Science","Cyber Security","Information Science","Biology","Business","English","History","Chemistry","Accounting","Communication"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden">
            {filteredStudies.length === 0 ? (
              <div className="text-center py-16">
                <Edit3 className="w-12 h-12 mx-auto mb-3" style={{ color: '#C0C0C0' }} />
                <p className="font-semibold text-gray-500">No studies found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredStudies.map(s => (
                  <div key={s.study_id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-gray-800">{s.title}</p>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: statusColors[s.status]?.bg || '#F3F4F6', color: statusColors[s.status]?.text || '#6B7280' }}>
                          {s.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {[s.department, s.study_type, s.credit_value ? `${s.credit_value} credits` : null].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`${editStudyPath}/${s.study_id}`)}
                        className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                        style={{ backgroundColor: '#003580' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(s.study_id)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors border border-red-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
  if (!study) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F6F9' }}>
      <Card className="p-8 text-center border-0 shadow-md">
        <p className="font-semibold text-gray-600">Study not found</p>
        <button onClick={() => navigate(editStudyPath)} className="mt-4 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: '#003580' }}>
          Back to Studies
        </button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Study</h1>
              <p className="text-blue-200 text-sm">{study.title}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: statusColors[study.status]?.bg || '#F3F4F6', color: statusColors[study.status]?.text || '#6B7280' }}>
            {study.status}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        {/* Basic Info */}
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#003580' }}>Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Study Name *</label>
              <input value={study.title || ""} onChange={e => setStudy({ ...study, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Proctor</label>
              <input value={study.proctor || ""} onChange={e => setStudy({ ...study, proctor: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Department</label>
              <select value={study.department || ""} onChange={e => setStudy({ ...study, department: e.target.value })} className={inputClass}>
                <option value="">Select department</option>
                {["Psychology","Computer Science","Cyber Security","Information Science","Biology","Business","English","History","Chemistry","Accounting","Communication"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Study Details */}
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#003580' }}>Study Details</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Study Type</label>
              <select value={study.study_type || ""} onChange={e => setStudy({ ...study, study_type: e.target.value })} className={inputClass}>
                <option value="">Select type</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Duration</label>
              <select value={study.duration || ""} onChange={e => setStudy({ ...study, duration: e.target.value })} className={inputClass}>
                <option value="">Select duration</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Credits</label>
              <select value={study.credit_value ?? ""} onChange={e => setStudy({ ...study, credit_value: Number(e.target.value) })} className={inputClass}>
                <option value="">Select credits</option>
                <option value="1">1.0</option>
                <option value="2">2.0</option>
                <option value="3">3.0</option>
                <option value="4">4.0</option>
                <option value="5">5.0</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Building</label>
              <select value={(study as any).building || ""} onChange={e => setStudy({ ...study, ...{ building: e.target.value } } as any)} className={inputClass}>
                <option value="">Select building</option>
                <option value="Luter">Luter</option>
                <option value="Forbes">Forbes</option>
                <option value="McMurran">McMurran</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Room Number</label>
              <input type="number" value={(study as any).room_number || ""}
                onChange={e => setStudy({ ...study, ...{ room_number: e.target.value } } as any)}
                className={inputClass} placeholder="e.g. 204" />
            </div>
            <div>
              <label className={labelClass}>Max Participants</label>
              <input type="number" value={study.max_participants ?? ""}
                onChange={e => setStudy({ ...study, max_participants: Number(e.target.value) })}
                className={inputClass} />
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#003580' }}>Description & Eligibility</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Description</label>
              <textarea rows={4} value={study.description || ""}
                onChange={e => setStudy({ ...study, description: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Eligibility Criteria</label>
              <textarea rows={3} value={study.eligibility_criteria || ""}
                onChange={e => setStudy({ ...study, eligibility_criteria: e.target.value })}
                className={inputClass} />
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#003580' }}>Settings</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={study.is_active ?? true}
                onChange={e => setStudy({ ...study, is_active: e.target.checked })}
                className="w-4 h-4 rounded" />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={study.requires_prescreen ?? false}
                onChange={e => setStudy({ ...study, requires_prescreen: e.target.checked })}
                className="w-4 h-4 rounded" />
              <span className="text-sm font-medium text-gray-700">Requires Prescreen</span>
            </label>
          </div>
        </Card>

        <div className="flex gap-4">
          <button onClick={() => navigate(editStudyPath)}
            className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all"
            style={{ borderColor: '#003580', color: '#003580' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: saving ? '#C0C0C0' : '#003580' }}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}