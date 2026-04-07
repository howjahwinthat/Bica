import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
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

export function CreateStudy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRA = user?.role === "researcher";
  const [sessions, setSessions] = useState<Session[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudyFormData>({
    defaultValues: {
      isActive: true,
      requiresPrescreen: false,
    },
  });

  const addSession = () => {
    setSessions([...sessions, { session_date: "", start_time: "", end_time: "", capacity: 10 }]);
  };

  const removeSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const updateSession = (index: number, field: keyof Session, value: string | number) => {
    const updated = [...sessions];
    updated[index] = { ...updated[index], [field]: value };
    setSessions(updated);
  };

  const onSubmit = async (data: StudyFormData) => {
    try {
      const res = await fetch("http://localhost:3600/api/studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          proctor: data.proctor,
          department: data.department,
          studyType: data.studyType,
          duration: data.duration,
          credits: data.credits,
          description: data.description,
          eligibilityCriteria: data.eligibilityCriteria,
          isActive: data.isActive,
          requiresPrescreen: data.requiresPrescreen,
          building: data.building,
          roomNumber: data.roomNumber,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create study");
      }

      const study = await res.json();

      // Create sessions if any
      if (sessions.length > 0) {
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
      }

      toast.success("Study created successfully!");
      navigate(isRA ? "/ra/dashboard" : "/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate(isRA ? "/ra/dashboard" : "/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Create New Study</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Study Name *</Label>
              <Input {...register("title", { required: "Study name is required" })} />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label>Proctor *</Label>
              <Input {...register("proctor", { required: "Proctor name is required" })} />
              {errors.proctor && <p className="text-sm text-red-600 mt-1">{errors.proctor.message}</p>}
            </div>

            <div>
              <Label>Department *</Label>
              <select {...register("department", { required: "Department is required" })} className="block w-full mt-1 p-2 border rounded">
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
              {errors.department && <p className="text-sm text-red-600 mt-1">{errors.department.message}</p>}
            </div>

            <div>
              <Label>Study Type *</Label>
              <select {...register("studyType", { required: "Study type is required" })} className="block w-full mt-1 p-2 border rounded">
                <option value="">Select type</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
              {errors.studyType && <p className="text-sm text-red-600 mt-1">{errors.studyType.message}</p>}
            </div>

            <div>
              <Label>Duration *</Label>
              <select {...register("duration", { required: "Duration is required" })} className="block w-full mt-1 p-2 border rounded">
                <option value="">Select duration</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
              {errors.duration && <p className="text-sm text-red-600 mt-1">{errors.duration.message}</p>}
            </div>

            <div>
              <Label>Credits *</Label>
              <select {...register("credits", { required: "Credits are required" })} className="block w-full mt-1 p-2 border rounded">
                <option value="">Select credits</option>
                <option value="1.0">1.0</option>
                <option value="2.0">2.0</option>
                <option value="3.0">3.0</option>
                <option value="4.0">4.0</option>
                <option value="5.0">5.0</option>
              </select>
              {errors.credits && <p className="text-sm text-red-600 mt-1">{errors.credits.message}</p>}
            </div>

            <div>
              <Label>Building *</Label>
              <select {...register("building", { required: "Building is required" })} className="block w-full mt-1 p-2 border rounded">
                <option value="">Select building</option>
                <option value="Luter">Luter</option>
                <option value="Forbes">Forbes</option>
                <option value="McMurran">McMurran</option>
              </select>
              {errors.building && <p className="text-sm text-red-600 mt-1">{errors.building.message}</p>}
            </div>

            <div>
              <Label>Room Number *</Label>
              <Input
                type="number"
                placeholder="e.g. 101"
                {...register("roomNumber", {
                  required: "Room number is required",
                  min: { value: 100, message: "Room number must be between 100 and 300" },
                  max: { value: 300, message: "Room number must be between 100 and 300" },
                })}
              />
              {errors.roomNumber && <p className="text-sm text-red-600 mt-1">{errors.roomNumber.message}</p>}
            </div>

            <div>
              <Label>Study Description</Label>
              <Textarea {...register("description")} rows={4} />
            </div>

            <div>
              <Label>Eligibility Criteria</Label>
              <Textarea {...register("eligibilityCriteria")} rows={3} />
            </div>

            {/* SESSIONS */}
            <hr className="my-4" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Time Slots</h2>
              <Button type="button" onClick={addSession} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Time Slot
              </Button>
            </div>

            {sessions.length === 0 && (
              <p className="text-sm text-gray-500">No time slots added yet. Click "Add Time Slot" to add one.</p>
            )}

            {sessions.map((session, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Time Slot {index + 1}</h3>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeSession(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={session.session_date}
                    onChange={(e) => updateSession(index, "session_date", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Time *</Label>
                    <Input
                      type="time"
                      value={session.start_time}
                      onChange={(e) => updateSession(index, "start_time", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Time *</Label>
                    <Input
                      type="time"
                      value={session.end_time}
                      onChange={(e) => updateSession(index, "end_time", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Capacity *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={session.capacity}
                    onChange={(e) => updateSession(index, "capacity", Number(e.target.value))}
                  />
                </div>
              </div>
            ))}

            <Button type="submit" className="w-full mt-4">
              Create Study
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}