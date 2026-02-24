import axios from "axios";

axios
  .get("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => {
    console.log("Axios GET response:", response.data);
  })
  .catch((error) => {
    console.error("Axios error:", error);
  });
