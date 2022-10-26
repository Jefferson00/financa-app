import axios from 'axios';

const api = axios.create({
  baseURL: 'https://financa-api-jefferson00.vercel.app/',
});

export default api;

// http://localhost:3333/
// https://financa-api-jefferson00.vercel.app/
// 'https://financeapi-production.up.railway.app/'
