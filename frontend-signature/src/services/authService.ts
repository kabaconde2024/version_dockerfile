// services/authService.ts
import api from './api';

const authService = {
    connecter: async (email: string, password: string) => {
        const response = await api.post('/auth/connexion', {
            email,
            motDePasse: password
        });
        
        console.log("Réponse API connexion:", response.data);
        
        if (response.data.necessiteMfa !== undefined) {
            return response.data;
        } else {
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

    inscrire: async (
        email: string, motDePasse: string, prenom: string, nom: string, 
        cin: string, telephone: string, dateNaissance: string, civilite: string,
        adresse: string, ville: string, codePostal: string
    ) => {
        const response = await api.post('/auth/inscription', {
            email, motDePasse, prenom, nom, cin, telephone, 
            dateNaissance, civilite, adresse, ville, codePostal
        });
        return response.data;
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
        localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    },

    motDePasseOublie: async (email: string) => {
        return await api.post(`/auth/mot-de-passe-oublie?email=${email}`);
    },

    validerNouveauMdp: async (token: string | null, nouveauMdp: string) => {
        return await api.post(`/auth/reinitialiser?token=${token}`, nouveauMdp, {
            headers: { 'Content-Type': 'text/plain' } 
        });
    },

    connecterAvecGoogle: async (idToken: string) => {
        const response = await api.post('/auth/google', { token: idToken });
        return response.data;
    }
};

export default authService;