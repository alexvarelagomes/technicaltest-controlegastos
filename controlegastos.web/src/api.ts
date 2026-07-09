import axios from 'axios';

// Cria uma instância com a URL da API.
const api = axios.create({baseURL: 'http://localhost:5055',});

export default api;