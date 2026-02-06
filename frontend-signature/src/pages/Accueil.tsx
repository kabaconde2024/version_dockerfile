import React, { useEffect } from 'react';
import { 
  Container, Typography, Button, Box, Grid, 
  Card, CardContent, Paper, Stack, Divider, Chip, Tooltip, AppBar, Toolbar, IconButton
} from '@mui/material';
import { 
  Security, Lock, VerifiedUser, Gavel, 
  Language, CloudDone, HistoryEdu, AccountCircle,
  Fingerprint, UploadFile, Create, AccessTime, CheckCircle, Storage
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Accueil: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const utilisateur = authService.getUtilisateurCourant();
    if (utilisateur) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const signatureSteps = [
    { title: 'Authentification', subtitle: '2FA / OAuth2', icon: <Fingerprint color="primary" sx={{ fontSize: 40 }} /> },
    { title: 'Upload & Hash', subtitle: 'SHA-256', icon: <UploadFile color="primary" sx={{ fontSize: 40 }} /> },
    { title: 'Signature', subtitle: 'Clé Privée + HSM', icon: <Create color="primary" sx={{ fontSize: 40 }} /> },
    { title: 'Horodatage', subtitle: 'TSA Authority', icon: <AccessTime color="primary" sx={{ fontSize: 40 }} /> },
    { title: 'Validation', subtitle: 'Chaîne (CA)', icon: <CheckCircle color="primary" sx={{ fontSize: 40 }} /> },
    { title: 'Archivage', subtitle: 'Logs & Preuves', icon: <Storage color="primary" sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fcfcfc' }}>
      
      {/* NAVBAR */}
      <AppBar position="absolute" elevation={0} sx={{ background: 'transparent' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
              TRUST-SIGN
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AccountCircle />}
              onClick={() => navigate('/connexion')}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main', 
                fontWeight: 'bold',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                borderRadius: 2
              }}
            >
              Connexion
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* SECTION HERO */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          pt: { xs: 15, md: 20 },
          pb: { xs: 10, md: 15 },
          background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #42a5f5 100%)',
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Chip 
                  label="Conformité eIDAS & Loi 2000-83" 
                  sx={{ width: 'fit-content', fontWeight: 'bold', bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
                <Typography variant="h2" component="h1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  Bâtir la Confiance Numérique Sans Frontières
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
                  Solution de signature électronique à valeur juridique probante, conçue pour l'interopérabilité globale et la sécurité de grade industriel.
                </Typography>
                <Box>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    sx={{ color: 'white', borderColor: 'white', px: 4, borderRadius: 2, borderWidth: 2 }}
                    onClick={() => navigate('/documentation')}
                  >
                    Documentation Technique
                  </Button>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
               <Box 
                  component="img" 
                  src="https://img.freepik.com/free-vector/digital-signature-concept-illustration_114360-3135.jpg" 
                  sx={{ width: '100%', borderRadius: 8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SECTION FLUX DE SIGNATURE (Basée sur votre image) */}
      <Container maxWidth="lg" sx={{ mt: -8, mb: 10, position: 'relative', zIndex: 10 }}>
        <Paper elevation={10} sx={{ p: 4, borderRadius: 4, bgcolor: 'white' }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 4, color: 'text.primary' }}>
            Architecture Fonctionnelle du Flux
          </Typography>
          <Grid container spacing={2}>
            {signatureSteps.map((step, index) => (
              <Grid item xs={6} md={2} key={index}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#f8faff', 
                      borderRadius: 3, 
                      border: '1px solid',
                      borderColor: 'primary.light',
                      height: '100%',
                      transition: '0.3s',
                      '&:hover': { transform: 'translateY(-5px)', bgcolor: 'primary.50' }
                    }}
                  >
                    <Box sx={{ mb: 1 }}>{step.icon}</Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.subtitle}
                    </Typography>
                  </Paper>
                  {index < signatureSteps.length - 1 && (
                    <Box sx={{ 
                      display: { xs: 'none', md: 'block' }, 
                      position: 'absolute', 
                      top: '50%', 
                      right: -10, 
                      zIndex: 5,
                      transform: 'translateY(-50%)'
                    }}>
                      <Typography variant="h5" color="primary.light">→</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* SECTION STANDARDS */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          {[
            { label: 'eIDAS (Europe)', icon: <Language /> },
            { label: 'ANSI (Tunisie)', icon: <Gavel /> },
            { label: 'ISO 27001', icon: <Security /> },
            { label: 'Loi 2000-83', icon: <VerifiedUser /> }
          ].map((std, index) => (
            <Grid item key={index}>
              <Paper variant="outlined" sx={{ px: 3, py: 1, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 1 }}>
                {std.icon}
                <Typography variant="subtitle2" fontWeight="bold">{std.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FOOTER */}
      <Box sx={{ bgcolor: '#0a1929', color: 'white', py: 6, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold">Digital Trust Platform</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Projet de Fin d'Études dédié à la sécurisation des échanges numériques.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
              <Typography variant="caption" sx={{ opacity: 0.5 }}>
                © {new Date().getFullYear()} Protected Consulting Partnership.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Accueil;