import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";

export interface Timeslot {
  id: number;
  room_id: number;
  title: string;
  study_type: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  capacity: number;
}

const TimeslotList: React.FC = () => {
  const { user } = useAuth();
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch timeslots from backend
  const fetchTimeslots = async () => {
    try {
      const response = await axios.get<Timeslot[]>("http://localhost:3000/api/timeslots");
      setTimeslots(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load timeslots.");
    }
  };

  // Delete a timeslot
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/timeslots/${id}`);
      setTimeslots(timeslots.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete timeslot.");
    }
  };

  useEffect(() => {
    fetchTimeslots();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Timeslots</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Room ID</th>
            <th>Title</th>
            <th>Study Type</th>
            <th>Description</th>
            <th>Start</th>
            <th>End</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeslots.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.room_id}</td>
              <td>{t.title}</td>
              <td>{t.study_type}</td>
              <td>{t.description}</td>
              <td>{t.start_datetime}</td>
              <td>{t.end_datetime}</td>
              <td>{t.capacity}</td>
              <td>
                <button
                  onClick={() => handleDelete(t.id)}
                  style={{ color: "white", backgroundColor: "red", padding: "0.25rem 0.5rem", border: "none", borderRadius: "4px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {timeslots.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>
                No timeslots found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimeslotList;
