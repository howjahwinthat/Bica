import axios from "axios";

const newTimeslot = {
  room_id: 1,
  title: "Test Study Session",
  study_type: "Group Study",
  description: "Testing Axios POST",
  start_datetime: "2026-02-19T14:00",
  end_datetime: "2026-02-19T14:30",
  capacity: 5
};

axios.post("http://localhost:3000/api/timeslots", newTimeslot)
  .then(res => console.log("POST response:", res.data))
  .catch(err => console.error("POST error:", err.response?.data || err));
