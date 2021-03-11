import axios from "axios";

export default axios.create({
  baseURL: "https://grupo-a-challenge.herokuapp.com/api",
  headers: {
    "Content-type": "application/json",
  },
});
