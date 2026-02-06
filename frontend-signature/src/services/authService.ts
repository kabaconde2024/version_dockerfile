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
    if (!token || !utilisateur) {
        console.error("Tentative de sauvegarde invalide :", { token, utilisateur });
        return;
    }

    // On s'assure que l'ID existe (id pour SQL, _id pour MongoDB)
    const id = utilisateur.id || utilisateur._id;
    
    if (!id) {
        console.warn("Attention: L'utilisateur sauvegardé n'a pas d'ID !", utilisateur);
    }

    localStorage.setItem('token', token);
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
},

    motDePasseOublie: async (email: string) => {
        return await api.post(`/auth/mot-de-passe-oublie?email=${email}`);
    },

// services/authService.ts
validerNouveauMdp: async (token: string | null, nouveauMdp: string) => {
    if (!token) {
        throw new Error("Token manquant");
    }
    
    try {
        const response = await api.post(
            `/auth/reinitialiser?token=${token}`,
            { nouveauMdp: nouveauMdp }, // Format JSON correct
            {
                headers: { 
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error: any) {
        // Gestion améliorée des erreurs
        if (error.response?.status === 400) {
            throw new Error(error.response.data?.message || "Token invalide ou expiré");
        } else if (error.response?.status === 415) {
            throw new Error("Erreur de format de requête");
        }
        throw error;
    }
},
    connecterAvecGoogle: async (idToken: string) => {
        const response = await api.post('/auth/google', { token: idToken });
        return response.data;
    }

    
};

export default authService;