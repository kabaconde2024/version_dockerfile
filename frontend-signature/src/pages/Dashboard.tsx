import React from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const utilisateur = authService.getUtilisateurCourant();

  const handleLogout = () => {
    authService.deconnecter();
    navigate('/connexion');
  };

  if (!utilisateur) {
    return (
      <Container>
        <Typography>Veuillez vous connecter</Typography>
        <Button onClick={() => navigate('/connexion')}>Se connecter</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">
            Bienvenue, {utilisateur.prenom} {utilisateur.nom} !
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>

        <Typography variant="h6" color="text.secondary" paragraph>
          Email: {utilisateur.email}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          CIN: {utilisateur.cin}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          2FA: {utilisateur.mfaActive ? 'Activé' : 'Désactivé'}
        </Typography>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Tableau de bord - En développement
          </Typography>
          <Typography>
            Les fonctionnalités de signature numérique seront disponibles prochainement.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;