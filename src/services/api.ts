import axios from 'axios';

const api = axios.create({
  baseURL: 'https://financeapi-production.up.railway.app/',
});

export default api;
