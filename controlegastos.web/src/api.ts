import axios from 'axios';

// Cria uma instância com a URL da API.
const api = axios.create({baseURL: 'https://api-controle-gastos-si2n.onrender.com/',});

export default api;