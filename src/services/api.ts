import axios from 'axios';

const api = axios.create({
  baseURL: 'https://financa-app-api.herokuapp.com/',
});

export default api;
