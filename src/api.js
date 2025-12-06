import axios from "axios";
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND || "http://localhost:4000",
  withCredentials: true
});
export default instance;
