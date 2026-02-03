// services/authService.ts
import axios from 'axios';
import api from './api';
const API_URL = 'http://localhost:8080/api/auth';
const authService = {
    connecter: async (email: string, password: string) => {
        const response = await api.post('/auth/connexion', {
            email,
            motDePasse: password
        });
        
        console.log("Réponse API connexion:", response.data);
        
        // Assurez-vous que la réponse contient les bons champs
        if (response.data.necessiteMfa !== undefined) {
            return response.data;
        } else {
            // Si la structure est différente, adaptez
            const result = response.data;
            return {
                succes: result.succes || true,
                necessiteMfa: result.mfaRequired || result.necessiteMfa || false,
                email: result.email || email,
                tokenAcces: result.tokenAcces || result.accessToken,
                utilisateur: result.utilisateur || result.user
            };
        }
    },

    

    verifierMfa: async (email: string, code: string) => {
        const response = await api.post('/auth/verifier-mfa', {
            email,
            code
        });
        return response.data;
    },
getUtilisateurCourant: () => {
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  deconnecter: () => {
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('token');
  },
    renvoyerCodeMfa: async (email: string) => {
        const response = await api.post('/auth/renvoyer-code-mfa', {
            email
        });
        return response.data;
    },

    sauvegarderUtilisateur: (utilisateur: any, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(utilisateur));
    },
    // authService.ts

// 1. Demander le mail
motDePasseOublie: async (email: string) => {
    return await axios.post(`${API_URL}/mot-de-passe-oublie?email=${email}`);
},

// 2. Envoyer le nouveau mot de passe avec le token
validerNouveauMdp: async (token: string | null, nouveauMdp: string) => {
    // Note : on envoie le mot de passe en tant que String brute ou objet JSON selon ton @RequestBody Backend
    return await axios.post(`${API_URL}/reinitialiser?token=${token}`, nouveauMdp, {
        headers: { 'Content-Type': 'text/plain' } 
    });
},
connecterAvecGoogle: async (idToken: string) => {
  const response = await axios.post(`${API_URL}/google`, { token: idToken });
  return response.data;
}
    

};



export default authService;