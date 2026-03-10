import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO, addMinutes, isBefore } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";

interface Room {
  id: number;
  name: string;
  capacity: number;
}

interface TimeslotFormData {
  room_id: number;
  title: string;
  study_type: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  capacity: number;
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

const EditTimeslot: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<TimeslotFormData>();

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

  // Load timeslot data
  useEffect(() => {
    if (!id) return;

    const fetchTimeslot = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/timeslots/${id}`);
        if (!res.ok) throw new Error();
        const data: TimeslotFormData = await res.json();

        setValue("room_id", data.room_id);
        setValue("title", data.title);
        setValue("study_type", data.study_type);
        setValue("description", data.description);
        setValue("start_datetime", data.start_datetime);
        setValue("end_datetime", data.end_datetime);
        setValue("capacity", data.capacity);
      } catch {
        setError("Failed to load timeslot data.");
      }
    };

    fetchTimeslot();
  }, [id, setValue]);

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

  const onSubmit = async (data: TimeslotFormData) => {
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`http://localhost:3000/api/timeslots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch {
      setError("Failed to update timeslot.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit Timeslot</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Timeslot updated!</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Room *</label>
          <select {...register("room_id", { required: true })}>
            <option value="">Select Room</option>
            {rooms.map((room) => (
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
            {studyTypes.map((type) => (
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

        <button type="submit">Update Timeslot</button>
      </form>
    </div>
  );
};

export default EditTimeslot;
