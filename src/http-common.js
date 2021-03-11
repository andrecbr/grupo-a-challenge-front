import axios from "axios";

export default axios.create({
  baseURL: "http://grupo-a-challenge.herokuapp.com/api",
  headers: {
    "Content-type": "application/json",
  },
});
