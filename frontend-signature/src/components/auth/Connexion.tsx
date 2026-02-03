import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  Snackbar,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { GoogleLogin } from '@react-oauth/google';

const Connexion: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');

    try {
      const result = await authService.connecter(email, motDePasse);
      
      if (result.necessiteMfa === true) {
        navigate('/verifier-mfa', { 
          state: { email: result.email || email },
          replace: true
        });
        return;
      } 

      if (result.tokenAcces) {
        authService.sauvegarderUtilisateur(result.utilisateur, result.tokenAcces);
        navigate('/dashboard', { replace: true });
        return;
      }
      
      setErreur('Réponse inattendue du serveur');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          (error.response?.status === 401 ? 'Identifiants incorrects' : 'Erreur de connexion');
      setErreur(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      // Appel au service pour gérer le token Google
      const res = await authService.connecterAvecGoogle(credentialResponse.credential);
      authService.sauvegarderUtilisateur(res.utilisateur, res.tokenAcces);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setErreur("L'authentification Google a échoué côté serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Connexion
        </Typography>

        {erreur && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {erreur}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Se connecter'}
          </Button>
        </form>

        <Box sx={{ my: 2 }}>
          <Divider>OU</Divider>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErreur('Échec de la connexion Google')}
            useOneTap
            shape="rectangular"
            theme="filled_blue"
          />
        </Box>

        <Box mt={4} textAlign="center" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/mot-de-passe-oublie')}
          >
            Mot de passe oublié ?
          </Link>
          
          <Typography variant="body2">
            Pas de compte ?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/inscription')}
            >
              S'inscrire
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Connexion;