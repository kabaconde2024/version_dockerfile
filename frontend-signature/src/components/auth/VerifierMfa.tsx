import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Email as EmailIcon 
} from '@mui/icons-material';
import authService from '../../services/authService';

const VerifierMfa: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!email) {
      navigate('/connexion');
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Le code doit avoir 6 chiffres");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await authService.verifierMfa(email, code);
      if (result.tokenAcces) {
        authService.sauvegarderUtilisateur(result.utilisateur, result.tokenAcces);
        navigate('/dashboard', { replace: true });
      } else {
        setError("Échec de la vérification");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Code invalide. Réessayez.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setSending(true);
    setError('');
    
    try {
      const result = await authService.renvoyerCodeMfa(email);
      setCountdown(60); // Bloquer le renvoi pendant 60 secondes
      
      // Utiliser Snackbar au lieu de alert()
      setSnackbar({
        open: true,
        message: result.message || "Un nouveau code a été envoyé à votre email"
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Erreur lors de l'envoi du code";
      setError(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!email) {
    return null; // Redirection gérée par useEffect
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%',
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          </Box>
          
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Vérification en deux étapes
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Nous avons envoyé un code à 6 chiffres à :
          </Typography>
          
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              textAlign: 'left',
              bgcolor: 'primary.50',
              border: '1px solid',
              borderColor: 'primary.100'
            }}
            icon={false}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" />
              <Typography variant="body1" fontWeight="medium">
                {email}
              </Typography>
            </Box>
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              Vérifiez votre boîte de réception et le dossier spam.
            </Typography>
          </Alert>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Code de vérification"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
              if (value.length === 6) {
                // Auto-soumettre quand 6 chiffres entrés
                handleVerify();
              }
            }}
            disabled={loading}
            inputProps={{ 
              maxLength: 6,
              inputMode: 'numeric',
              pattern: '[0-9]*',
              style: { 
                textAlign: 'center', 
                fontSize: '1.8rem', 
                letterSpacing: '10px',
                fontWeight: 'bold'
              }
            }}
            sx={{ mb: 3 }}
            placeholder="123456"
            autoFocus
          />
          
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerify}
            disabled={loading || code.length !== 6}
            sx={{ 
              mb: 2, 
              py: 1.5,
              fontWeight: 'bold'
            }}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Vérifier le code'}
          </Button>
          
          <Box sx={{ 
            mt: 3, 
            pt: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="body2" color="text.secondary">
              Vous n'avez pas reçu le code ?
            </Typography>
            
            <Button
              variant="outlined"
              onClick={handleResendCode}
              disabled={sending || countdown > 0}
              startIcon={<RefreshIcon />}
              size="small"
            >
              {sending ? 'Envoi en cours...' : 
               countdown > 0 ? `Renvoyer (${countdown}s)` : 'Renvoyer le code'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/connexion')}
              sx={{ color: 'text.secondary' }}
            >
              ← Retour à la connexion
            </Link>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar pour les messages de succès */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default VerifierMfa;