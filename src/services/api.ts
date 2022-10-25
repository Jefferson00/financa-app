import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/',
});

export default api;

// 'https://financeapi-production.up.railway.app/'
