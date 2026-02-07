import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Alert, Box, CircularProgress } from '@mui/material';
import authService from '../../services/authService';
import axios from 'axios';
const API_BASE_URL = "https://version-dockerfile.onrender.com";
const ReinitialiserPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        return setStatus({ type: 'error', msg: 'Les mots de passe ne correspondent pas' });
    }

    if (password.length < 6) {
        return setStatus({ type: 'error', msg: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
        // CORRECTION : Utilisation de l'URL Render au lieu de localhost
        // On utilise la constante API_BASE_URL que vous avez définie en haut du fichier
        const response = await axios.post(
            `${API_BASE_URL}/api/auth/reinitialiser?token=${token}`,
            { nouveauMdp: password }, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            setStatus({ 
                type: 'success', 
                msg: 'Mot de passe modifié avec succès ! Redirection vers la connexion...' 
            });
            setTimeout(() => navigate('/connexion'), 3000);
        }
    } catch (err: any) {
        console.error('Erreur lors de la réinitialisation:', err);
        const errorMsg = err.response?.data?.message || err.response?.data || 'Le lien est invalide ou a expiré.';
        setStatus({ type: 'error', msg: errorMsg });
    } finally {
        setLoading(false);
    }
};

    if (!token) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Lien invalide (token manquant).</Alert>
                <Button 
                    variant="text" 
                    onClick={() => navigate('/connexion')}
                    sx={{ mt: 2 }}
                >
                    Retour à la connexion
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
                    Nouveau mot de passe
                </Typography>
                
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Veuillez entrer votre nouveau mot de passe
                </Typography>

                {status.msg && (
                    <Alert 
                        severity={status.type as any} 
                        sx={{ mb: 2 }}
                    >
                        {status.msg}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Nouveau mot de passe"
                        type="password"
                        margin="normal"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        helperText="Minimum 6 caractères"
                        disabled={loading}
                    />
                    
                    <TextField
                        fullWidth
                        label="Confirmer le mot de passe"
                        type="password"
                        margin="normal"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />
                    
                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Mettre à jour'}
                    </Button>
                </form>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button 
                        variant="text" 
                        onClick={() => navigate('/connexion')}
                        size="small"
                    >
                        Retour à la connexion
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ReinitialiserPassword;