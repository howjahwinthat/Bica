import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Search, ClipboardList, Loader2 } from "lucide-react";
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
  const { user } = useAuth();
  const isRA = user?.role === "researcher";
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterOpen, setFilterOpen] = useState("");

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch("http://localhost:3600/api/studies");
        if (res.ok) {
          const data = await res.json();
          setStudies(data.filter((s: Study) => s.status === "active"));
        } else toast.error("Failed to load studies");
      } catch { toast.error("Could not connect to server"); }
      finally { setLoading(false); }
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
      setStudies(prev => prev.map(s => s.study_id === study.study_id ? { ...s, is_open: newIsOpen } : s));
      toast.success(`Study marked as ${newIsOpen ? "Open" : "Closed"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update study");
    } finally { setTogglingId(null); }
  };

  const filteredStudies = studies.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDepartment ? s.department === filterDepartment : true;
    const matchesType = filterType ? s.study_type === filterType : true;
    const matchesOpen = filterOpen === "open" ? s.is_open : filterOpen === "closed" ? !s.is_open : true;
    return matchesSearch && matchesDept && matchesType && matchesOpen;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Session Management</h1>
              <p className="text-blue-200 text-sm">{studies.length} active studies</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Filters */}
        <Card className="p-5 border-0 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search studies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
            </div>
            <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
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
            <select value={filterOpen} onChange={e => setFilterOpen(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
              <option value="">All Statuses</option>
              <option value="open">Open Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#003580' }} />
          </div>
        ) : studies.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-sm">
            <ClipboardList className="w-12 h-12 mx-auto mb-3" style={{ color: '#C0C0C0' }} />
            <p className="font-semibold text-gray-500">No approved studies yet</p>
            <p className="text-sm text-gray-400 mt-1">Approve studies from Study Approval first.</p>
          </Card>
        ) : filteredStudies.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-sm">
            <p className="font-semibold text-gray-500">No studies match your search</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredStudies.map(study => (
              <Card key={study.study_id} className="border-0 shadow-sm overflow-hidden">
                <div className="p-1" style={{ backgroundColor: study.is_open ? '#16A34A' : '#DC2626' }} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{study.title}</h3>
                      {study.proctor && <p className="text-sm text-gray-400 mt-0.5">Proctor: {study.proctor}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        study.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {study.is_open ? 'Open' : 'Closed'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#EBF0FA', color: '#003580' }}>
                        Active
                      </span>
                    </div>
                  </div>

                  {study.description && (
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{study.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {study.department && (
                      <div className="rounded-lg p-2.5" style={{ backgroundColor: '#F4F6F9' }}>
                        <p className="text-xs text-gray-400">Department</p>
                        <p className="font-semibold text-xs text-gray-700 mt-0.5">{study.department}</p>
                      </div>
                    )}
                    {study.study_type && (
                      <div className="rounded-lg p-2.5" style={{ backgroundColor: '#F4F6F9' }}>
                        <p className="text-xs text-gray-400">Type</p>
                        <p className="font-semibold text-xs text-gray-700 mt-0.5">{study.study_type}</p>
                      </div>
                    )}
                    {study.duration && (
                      <div className="rounded-lg p-2.5" style={{ backgroundColor: '#F4F6F9' }}>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="font-semibold text-xs text-gray-700 mt-0.5">{study.duration} min</p>
                      </div>
                    )}
                    {study.credit_value && (
                      <div className="rounded-lg p-2.5" style={{ backgroundColor: '#F4F6F9' }}>
                        <p className="text-xs text-gray-400">Credits</p>
                        <p className="font-semibold text-xs text-gray-700 mt-0.5">{study.credit_value}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleOpen(study)}
                    disabled={togglingId === study.study_id}
                    className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 flex items-center gap-2"
                    style={{ backgroundColor: study.is_open ? '#DC2626' : '#16A34A' }}
                  >
                    {togglingId === study.study_id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {togglingId === study.study_id ? 'Updating...' : study.is_open ? 'Close Study' : 'Open Study'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}