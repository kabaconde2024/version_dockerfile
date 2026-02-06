// services/api.ts
import axios from 'axios';

const api = axios.create({
    // Priorité à la variable d'env, sinon l'URL de production Render
    baseURL: import.meta.env.VITE_API_URL || 'https://version-dockerfile.onrender.com/api',
});

// Optionnel : Ajouter un intercepteur pour débugger l'URL dans la console
api.interceptors.request.use((config) => {
    return config;
});

export default api;