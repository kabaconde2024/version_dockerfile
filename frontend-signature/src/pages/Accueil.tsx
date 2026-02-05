import React, { useEffect } from 'react';
import { 
  Container, Typography, Button, Box, Grid, 
  Card, CardContent, Paper, Stack, Divider, Chip, Tooltip
} from '@mui/material';
import { 
  Security, Lock, VerifiedUser, Gavel, 
  Language, CloudDone, HistoryEdu, Business
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

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fcfcfc' }}>
      
      {/* SECTION HERO - International & Confiance */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          pt: { xs: 10, md: 15 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #42a5f5 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Chip 
                  label="Standard International eIDAS & ANSI Conforme" 
                  color="secondary" 
                  sx={{ width: 'fit-content', fontWeight: 'bold', bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
                <Typography variant="h2" component="h1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  Bâtir la Confiance Numérique Sans Frontières
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
                  Solution de signature électronique à valeur juridique probante. 
                  Conçue pour l'interopérabilité globale et la sécurité de grade industriel.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    color="secondary"
                    onClick={() => navigate('/inscription')}
                    sx={{ fontWeight: 'bold', px: 6, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
                  >
                    Démarrer maintenant
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    sx={{ color: 'white', borderColor: 'white', px: 4, borderRadius: 2 }}
                    onClick={() => navigate('/documentation')}
                  >
                    Documentation API
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Paper elevation={24} sx={{ p: 1, borderRadius: 4, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <Box 
                  component="img" 
                  src="https://img.freepik.com/free-vector/digital-signature-concept-illustration_114360-3135.jpg" 
                  alt="Interface Signature Sécurisée"
                  sx={{ width: '100%', borderRadius: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SECTION STANDARDS & CONFORMITÉ - Le cœur du PFE */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3} justifyContent="center">
          {[
            { label: 'eIDAS (Europe)', icon: <Language /> },
            { label: 'ANSI (Tunisie)', icon: <Gavel /> },
            { label: 'ISO 27001', icon: <Security /> },
            { label: 'GDPR / Loi 2000-83', icon: <VerifiedUser /> }
          ].map((std, index) => (
            <Grid item key={index}>
              <Tooltip title={`Conformité ${std.label}`}>
                <Paper variant="outlined" sx={{ px: 3, py: 1.5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 1, borderColor: 'primary.light' }}>
                  {std.icon}
                  <Typography variant="subtitle2" fontWeight="bold" color="primary">{std.label}</Typography>
                </Paper>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* SECTION ARCHITECTURE & FONCTIONNALITÉS */}
      <Box sx={{ py: 10, bgcolor: '#f4f7f9' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 2 }}>
            Puissance Technique, Simplicité d'Usage
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 800, mx: 'auto' }}>
            Une architecture moderne en microservices pour une scalabilité industrielle et une sécurité par design[cite: 76, 119].
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                title: 'Sécurité Cryptographique',
                desc: 'Implémentation PKI robuste avec hachage SHA-256 et clés RSA/HSM pour une inviolabilité totale[cite: 74, 101, 109].',
                icon: <Lock fontSize="large" color="primary" />
              },
              {
                title: 'Horodatage Certifié',
                desc: 'Preuve d\'existence et d\'intégrité grâce à une autorité de temps (TSA) intégrée au flux de signature[cite: 105, 110].',
                icon: <HistoryEdu fontSize="large" color="primary" />
              },
              {
                title: 'Traçabilité Immuable',
                desc: 'Audit trail complet stocké sur MongoDB garantissant la non-répudiation des actes.',
                icon: <CloudDone fontSize="large" color="primary" />
              }
            ].map((feat, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ height: '100%', borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 3 }}>{feat.icon}</Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">{feat.title}</Typography>
                    <Typography variant="body1" color="text.secondary">{feat.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* SECTION TRUST / PARTENAIRES */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="overline" display="block" align="center" gutterBottom sx={{ letterSpacing: 3, fontWeight: 'bold', color: 'text.secondary' }}>
          TECHNOLOGIES & STANDARDS UTILISÉS
        </Typography>
        <Stack direction="row" flexWrap="wrap" justifyContent="center" spacing={{ xs: 3, md: 8 }} sx={{ mt: 4, opacity: 0.6 }}>
          <Typography variant="h5" fontWeight="900">React.js</Typography>
          <Typography variant="h5" fontWeight="900">Spring Boot</Typography>
          <Typography variant="h5" fontWeight="900">PostgreSQL</Typography>
          <Typography variant="h5" fontWeight="900">Docker/K8s</Typography>
          <Typography variant="h5" fontWeight="900">Bouncy Castle</Typography>
        </Stack>
      </Container>

      {/* FOOTER PROFESSIONNEL */}
      <Box sx={{ bgcolor: '#0a1929', color: 'white', py: 8, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Digital Trust Platform
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 400 }}>
                Projet de Fin d'Études dédié à la sécurisation des échanges numériques. 
                Soutenu par Protected Consulting, leader en cybersécurité[cite: 26, 28].
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © {new Date().getFullYear()} Signature Numérique PFE. Tous droits réservés.
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', mt: 1 }}>
                Conformité : Loi n° 2000-83 (Tunisie) | Règlement eIDAS (UE) | ISO 27001[cite: 19, 64, 83, 84].
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Accueil;