import axios from 'axios';

export default axios.create({
  baseURL: 'https://backend-airtable2.onrender.com',
  withCredentials: true 
});
