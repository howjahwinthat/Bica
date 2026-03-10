import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO, isBefore, addMinutes } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";

interface Room {
  id: number;
  name: string;
  capacity: number;
  location?: string;
}

interface CreateFormData {
  room_id: number;
  title: string;
  study_type: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  capacity: number;
}

interface Timeslot extends CreateFormData {
  id: number;
}

const studyTypes = [
  "Group Study",
  "Individual Study",
  "Tutoring",
  "Exam Review",
  "Workshop",
  "Seminar",
  "Lab Session",
  "Quiet Study",
  "Other",
];

const CreateTimeslot: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateFormData>();

  const startDateTime = watch("start_datetime");

  // Load rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/rooms");
        if (!res.ok) throw new Error();
        const data: Room[] = await res.json();
        setRooms(data);
      } catch {
        setError("Failed to load rooms.");
      }
    };
    fetchRooms();
  }, []);

  // Ensure end time is at least 30 mins after start
  useEffect(() => {
    if (startDateTime) {
      const start = parseISO(startDateTime);
      const minEnd = addMinutes(start, 30);
      const minEndStr = format(minEnd, "yyyy-MM-dd'T'HH:mm");

      const endInput = document.getElementById("end_datetime") as HTMLInputElement;
      if (endInput) {
        endInput.min = minEndStr;
        if (endInput.value && isBefore(parseISO(endInput.value), minEnd)) {
          endInput.value = minEndStr;
          setValue("end_datetime", minEndStr);
        }
      }
    }
  }, [startDateTime, setValue]);

  const onSubmit = async (data: CreateFormData) => {
    setError(null);
    setSuccess(false);

    const start = parseISO(data.start_datetime);
    if (isBefore(start, new Date())) {
      setError("Start time must be in the future.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/timeslots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const created: Timeslot = await res.json();
      setTimeslots(prev => [...prev, created]);
      setSuccess(true);
      reset();
    } catch {
      setError("Failed to create timeslot.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Timeslot</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Timeslot created!</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Room *</label>
          <select {...register("room_id", { required: true })}>
            <option value="">Select Room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} (Cap: {room.capacity})
              </option>
            ))}
          </select>
          {errors.room_id && <p style={{ color: "red" }}>Room required</p>}
        </div>

        <div>
          <label>Title</label>
          <input type="text" {...register("title")} />
        </div>

        <div>
          <label>Study Type *</label>
          <select {...register("study_type", { required: true })}>
            <option value="">Select Type</option>
            {studyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.study_type && <p style={{ color: "red" }}>Study type required</p>}
        </div>

        <div>
          <label>Description</label>
          <textarea {...register("description")} />
        </div>

        <div>
          <label>Start Date & Time *</label>
          <input
            type="datetime-local"
            {...register("start_datetime", { required: true })}
            min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          />
          {errors.start_datetime && <p style={{ color: "red" }}>Start time required</p>}
        </div>

        <div>
          <label>End Date & Time *</label>
          <input
            type="datetime-local"
            id="end_datetime"
            {...register("end_datetime", { required: true })}
          />
          {errors.end_datetime && <p style={{ color: "red" }}>End time required</p>}
        </div>

        <div>
          <label>Capacity</label>
          <input
            type="number"
            min="1"
            {...register("capacity", { valueAsNumber: true })}
          />
        </div>

        <button type="submit">Create Timeslot</button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h3>Existing Timeslots</h3>
      {timeslots.length === 0 && <p>No timeslots yet.</p>}
      <ul>
        {timeslots.map(t => (
          <li key={t.id}>
            {t.title} ({t.study_type}) - {t.start_datetime} to {t.end_datetime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateTimeslot;
