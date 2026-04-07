import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
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
          status: newStatus,
          is_active: true,
          requires_prescreen: false,
          is_open: newStatus === "active",
        }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setStudies(prev => prev.map(s => s.study_id === study.study_id ? { ...s, status: newStatus } : s));
      toast.success(newStatus === "active" ? `"${study.title}" approved!` : `"${study.title}" rejected`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingStudies = studies.filter(s => s.status === "draft" || !s.status);
  const reviewedStudies = studies.filter(s => s.status === "active" || s.status === "closed");

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Study Approval</h1>
              <p className="text-blue-200 text-sm">{pendingStudies.length} pending · {reviewedStudies.length} reviewed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#003580' }} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending */}
            {pendingStudies.length === 0 ? (
              <Card className="p-12 text-center border-0 shadow-sm">
                <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#C0C0C0' }} />
                <p className="font-semibold text-gray-500">No pending approvals</p>
                <p className="text-sm text-gray-400 mt-1">All studies have been reviewed.</p>
              </Card>
            ) : (
              pendingStudies.map(study => (
                <Card key={study.study_id} className="border-0 shadow-sm overflow-hidden">
                  <div className="p-1" style={{ background: 'linear-gradient(90deg, #F59E0B, #FBBF24)' }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{study.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {[study.proctor, study.department].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                        <Clock className="w-3 h-3 inline mr-1" />Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {study.study_type && (
                        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#EBF0FA' }}>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Type</p>
                          <p className="font-semibold text-sm mt-0.5" style={{ color: '#003580' }}>{study.study_type}</p>
                        </div>
                      )}
                      {study.duration && (
                        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#EBF0FA' }}>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Duration</p>
                          <p className="font-semibold text-sm mt-0.5" style={{ color: '#003580' }}>{study.duration} min</p>
                        </div>
                      )}
                      {study.credit_value && (
                        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#EBF0FA' }}>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Credits</p>
                          <p className="font-semibold text-sm mt-0.5" style={{ color: '#003580' }}>{study.credit_value}</p>
                        </div>
                      )}
                    </div>

                    {study.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{study.description}</p>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Review Notes</label>
                      <Textarea
                        value={reviewNotes[study.study_id] || ""}
                        onChange={e => setReviewNotes({ ...reviewNotes, [study.study_id]: e.target.value })}
                        placeholder="Add feedback or notes for the researcher..."
                        rows={2}
                        className="border-gray-200 rounded-xl"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateStatus(study, "active")}
                        disabled={processingId === study.study_id}
                        className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                        style={{ backgroundColor: '#16A34A' }}
                      >
                        {processingId === study.study_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(study, "closed")}
                        disabled={processingId === study.study_id}
                        className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                        style={{ backgroundColor: '#DC2626' }}
                      >
                        {processingId === study.study_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Reject
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}

            {/* Reviewed */}
            {reviewedStudies.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 mt-8" style={{ color: '#003580' }}>Previously Reviewed</h2>
                <div className="space-y-3">
                  {reviewedStudies.map(study => (
                    <Card key={study.study_id} className="p-4 border-0 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{study.title}</p>
                          <p className="text-sm text-gray-400">{[study.proctor, study.department].filter(Boolean).join(' · ')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          study.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {study.status === 'active' ? '✓ Approved' : '✗ Rejected'}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}