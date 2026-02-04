// services/api.ts
import axios from 'axios';

const api = axios.create({
    // Avec Vite, on utilise import.meta.env au lieu de process.env
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

export default api;