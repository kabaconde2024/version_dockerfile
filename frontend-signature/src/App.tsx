import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Inscription from './components/auth/Inscription';
import Connexion from './components/auth/Connexion';
import Dashboard from './pages/Dashboard';
import Accueil from './pages/Accueil';
import VerifierMfa from './components/auth/VerifierMfa';
import MotDePasseOublie from './components/auth/MotDePasseOublie';
import ReinitialiserPassword from './components/auth/ReinitialiserPassword';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Thème Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    // On place le Provider Google ici, tout en haut de la hiérarchie
    <GoogleOAuthProvider clientId="320659477478-00hgntilql2f933lr33go2tie7b5em2u.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/accueil" />} />
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/verifier-mfa" element={<VerifierMfa />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
            <Route path="/reinitialiser-password" element={<ReinitialiserPassword />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;