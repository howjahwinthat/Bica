import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { Plus, Trash2, FileText } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

type StudyFormData = {
  title: string;
  proctor: string;
  department: string;
  studyType: string;
  duration: string;
  credits: string;
  description: string;
  eligibilityCriteria: string;
  isActive: boolean;
  requiresPrescreen: boolean;
  building: string;
  roomNumber: string;
};

type Session = {
  session_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
};

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all";
const selectClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all";
const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

export function CreateStudy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRA = user?.role === "researcher";
  const [sessions, setSessions] = useState<Session[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<StudyFormData>({
    defaultValues: { isActive: true, requiresPrescreen: false },
  });

  const addSession = () => setSessions([...sessions, { session_date: "", start_time: "", end_time: "", capacity: 10 }]);
  const removeSession = (i: number) => setSessions(sessions.filter((_, idx) => idx !== i));
  const updateSession = (i: number, field: keyof Session, value: string | number) => {
    const updated = [...sessions];
    updated[i] = { ...updated[i], [field]: value };
    setSessions(updated);
  };

  const onSubmit = async (data: StudyFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3600/api/studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title, proctor: data.proctor, department: data.department,
          studyType: data.studyType, duration: data.duration, credits: data.credits,
          description: data.description, eligibilityCriteria: data.eligibilityCriteria,
          isActive: data.isActive, requiresPrescreen: data.requiresPrescreen,
          building: data.building, roomNumber: data.roomNumber,
        }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to create study");
      const study = await res.json();
      for (const session of sessions) {
        if (session.session_date && session.start_time && session.end_time) {
          await fetch(`http://localhost:3600/api/studies/${study.study_id}/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_date: session.session_date,
              start_time: session.start_time,
              end_time: session.end_time,
              location: `${data.building} ${data.roomNumber}`,
              capacity: session.capacity,
            }),
          });
        }
      }
      toast.success("Study created successfully!");
      navigate(isRA ? "/ra/dashboard" : "/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Study</h1>
            <p className="text-blue-200 text-sm">Fill in the details below to submit a new research study</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Basic Info */}
          <Card className="p-6 border-0 shadow-sm">
            <h2 className="text-lg font-bold mb-5" style={{ color: '#003580' }}>Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Study Name *</label>
                <input {...register("title", { required: "Study name is required" })} className={inputClass} placeholder="e.g. Cognitive Behavior Study 2026" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Proctor *</label>
                <input {...register("proctor", { required: "Proctor is required" })} className={inputClass} placeholder="e.g. Dr. Smith" />
                {errors.proctor && <p className="text-red-500 text-xs mt-1">{errors.proctor.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Department *</label>
                <select {...register("department", { required: "Department is required" })} className={selectClass}>
                  <option value="">Select department</option>
                  {["Psychology","Computer Science","Cyber Security","Information Science","Biology","Business","English","History","Chemistry","Accounting","Communication"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
              </div>
            </div>
          </Card>

          {/* Study Details */}
          <Card className="p-6 border-0 shadow-sm">
            <h2 className="text-lg font-bold mb-5" style={{ color: '#003580' }}>Study Details</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Study Type *</label>
                <select {...register("studyType", { required: "Study type is required" })} className={selectClass}>
                  <option value="">Select type</option>
                  <option value="online">Online</option>
                  <option value="in-person">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.studyType && <p className="text-red-500 text-xs mt-1">{errors.studyType.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Duration *</label>
                <select {...register("duration", { required: "Duration is required" })} className={selectClass}>
                  <option value="">Select duration</option>
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                </select>
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Credits *</label>
                <select {...register("credits", { required: "Credits are required" })} className={selectClass}>
                  <option value="">Select credits</option>
                  <option value="1.0">1.0</option>
                  <option value="2.0">2.0</option>
                  <option value="3.0">3.0</option>
                  <option value="4.0">4.0</option>
                  <option value="5.0">5.0</option>
                </select>
                {errors.credits && <p className="text-red-500 text-xs mt-1">{errors.credits.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Building *</label>
                <select {...register("building", { required: "Building is required" })} className={selectClass}>
                  <option value="">Select building</option>
                  <option value="Luter">Luter</option>
                  <option value="Forbes">Forbes</option>
                  <option value="McMurran">McMurran</option>
                </select>
                {errors.building && <p className="text-red-500 text-xs mt-1">{errors.building.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Room Number *</label>
                <input type="number" placeholder="e.g. 204" {...register("roomNumber", {
                  required: "Room number is required",
                  min: { value: 100, message: "Must be between 100-300" },
                  max: { value: 300, message: "Must be between 100-300" },
                })} className={inputClass} />
                {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber.message}</p>}
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6 border-0 shadow-sm">
            <h2 className="text-lg font-bold mb-5" style={{ color: '#003580' }}>Description & Eligibility</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Study Description</label>
                <textarea {...register("description")} rows={4} placeholder="Describe the study purpose, procedures, and what participants can expect..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Eligibility Criteria</label>
                <textarea {...register("eligibilityCriteria")} rows={3} placeholder="e.g. Must be 18+, enrolled in PSYC 101..." className={inputClass} />
              </div>
            </div>
          </Card>

          {/* Time Slots */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#003580' }}>Time Slots</h2>
                <p className="text-xs text-gray-400 mt-0.5">Add one or more session time slots for participants to choose from</p>
              </div>
              <button type="button" onClick={addSession}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#003580' }}>
                <Plus className="w-4 h-4" /> Add Time Slot
              </button>
            </div>

            {sessions.length === 0 && (
              <div className="text-center py-8 rounded-xl" style={{ backgroundColor: '#F4F6F9' }}>
                <p className="text-gray-400 text-sm">No time slots added yet. Click "Add Time Slot" to add one.</p>
              </div>
            )}

            <div className="space-y-4">
              {sessions.map((session, i) => (
                <div key={i} className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#EBF0FA', border: '2px solid #C7D7F0' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm" style={{ color: '#003580' }}>Time Slot {i + 1}</h3>
                    <button type="button" onClick={() => removeSession(i)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Date *</label>
                      <input type="date" value={session.session_date}
                        onChange={e => updateSession(i, "session_date", e.target.value)}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Start Time *</label>
                      <input type="time" value={session.start_time}
                        onChange={e => updateSession(i, "start_time", e.target.value)}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>End Time *</label>
                      <input type="time" value={session.end_time}
                        onChange={e => updateSession(i, "end_time", e.target.value)}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Capacity *</label>
                      <input type="number" min={1} value={session.capacity}
                        onChange={e => updateSession(i, "capacity", Number(e.target.value))}
                        className={inputClass} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Submit */}
          <button type="submit" disabled={submitting}
            className="w-full py-4 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: submitting ? '#C0C0C0' : '#003580' }}>
            {submitting ? 'Creating Study...' : 'Create Study'}
          </button>
        </form>
      </div>
    </div>
  );
}