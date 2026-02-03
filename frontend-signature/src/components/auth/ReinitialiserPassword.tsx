import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Alert, Box } from '@mui/material';
import authService from '../../services/authService';

const ReinitialiserPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token'); // Récupère le token de l'URL

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setStatus({ type: 'error', msg: 'Les mots de passe ne correspondent pas' });
        }

        try {
            await authService.validerNouveauMdp(token, password);
            setStatus({ type: 'success', msg: 'Mot de passe modifié ! Redirection vers la connexion...' });
            setTimeout(() => navigate('/connexion'), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Le lien est invalide ou a expiré.' });
        }
    };

    if (!token) return <Container sx={{ mt: 4 }}><Alert severity="error">Lien invalide (token manquant).</Alert></Container>;

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>Nouveau mot de passe</Typography>
                {status.msg && <Alert severity={status.type as any} sx={{ mb: 2 }}>{status.msg}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth label="Nouveau mot de passe"
                        type="password" margin="normal" required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        fullWidth label="Confirmer le mot de passe"
                        type="password" margin="normal" required
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                        Mettre à jour
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default ReinitialiserPassword;