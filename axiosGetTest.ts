import axios from "axios";

const testGetRooms = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/rooms");
    console.log("GET response:", response.data);
  } catch (err) {
    console.error("GET error:", err);
  }
};

testGetRooms();
