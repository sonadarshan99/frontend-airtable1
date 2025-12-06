import axios from "axios";
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND || "https://backend-airtable2.onrender.com",
  withCredentials: true
});
export default instance;
