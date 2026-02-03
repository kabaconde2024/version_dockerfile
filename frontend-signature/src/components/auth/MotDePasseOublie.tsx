import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import authService from '../../services/authService';

const MotDePasseOublie = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.motDePasseOublie(email);
            setSent(true);
        } catch (err) {
            console.error("Erreur", err);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>Réinitialiser le mot de passe</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth label="Votre Email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        margin="normal" required
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                        Envoyer le lien
                    </Button>
                </form>
            </Paper>

            <Snackbar open={sent} autoHideDuration={6000} onClose={() => setSent(false)}>
                <Alert severity="success">Si cet email existe, un lien a été envoyé !</Alert>
            </Snackbar>
        </Container>
    );
};
export default MotDePasseOublie;