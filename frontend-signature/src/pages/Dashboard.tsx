import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Paper, Box, Grid,
  Avatar, Divider, Chip, Card, CardContent, Alert,
  LinearProgress, AppBar, Toolbar, useScrollTrigger, Stack,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload, Fingerprint, AccountCircle,
  Security, CheckCircle, Logout, Shield, VerifiedUser,
  History, FilePresent, TaskAlt, ErrorOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import CryptoJS from 'crypto-js';
import axios from 'axios';

// Effet d'élévation pour la Navbar
function ElevationScroll(props: any) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    style: {
      backgroundColor: trigger ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(10px)',
      color: trigger ? '#1A237E' : 'white',
      transition: 'all 0.3s ease-in-out'
    }
  });
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [utilisateur, setUtilisateur] = useState<any>(null);

  // États de base
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // États Signature
  const [isSigning, setIsSigning] = useState(false);
  const [signatureDone, setSignatureDone] = useState(false);
  const [lastSignatureBase64, setLastSignatureBase64] = useState<string>('');

  // États Vérification
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{valide: boolean, message: string} | null>(null);

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = () => {
      const user = authService.getUtilisateurCourant();
      if (!user) {
        // Redirection avec un léger délai pour éviter les problèmes de rendu
        setTimeout(() => {
          navigate('/connexion');
        }, 0);
      } else {
        setUtilisateur(user);
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    authService.deconnecter();
    navigate('/connexion');
  };

  // Gestion du hachage local du fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSignatureDone(false);
      setVerificationResult(null); // Reset du résultat précédent
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const binary = event.target?.result;
        if (binary) {
          const wa = CryptoJS.lib.WordArray.create(binary as any);
          const sha256Hash = CryptoJS.SHA256(wa).toString();
          setHash(sha256Hash);
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  // Fonction pour signer
  const handleSignerDocument = async () => {
    if (!hash || !file || !utilisateur) return;

    setIsSigning(true);
    try {
      const token = localStorage.getItem('token'); 
      const payload = {
        hash: hash,
        fileName: file.name,
        userId: utilisateur.id
      };

      const response = await axios.post('http://localhost:8080/api/signature/signer', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data) {
        setSignatureDone(true);
        // On récupère la signature générée par le backend pour permettre la vérification immédiate
        setLastSignatureBase64(response.data.signature);
        alert("Document signé avec succès !");
      }
    } catch (error) {
      console.error("Erreur de signature", error);
      alert("Erreur lors de la signature.");
    } finally {
      setIsSigning(false);
    }
  };

  // Fonction pour vérifier
  const handleVerifierDocument = async () => {
    if (!hash || !utilisateur || !lastSignatureBase64) return;
    
    setIsVerifying(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        hash: hash,
        signature: lastSignatureBase64,
        utilisateurId: utilisateur.id
      };

      const response = await axios.post('http://localhost:8080/api/signature/verifier', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setVerificationResult({
        valide: response.data.valide,
        message: response.data.message
      });
    } catch (error: any) {
      setVerificationResult({
        valide: false,
        message: error.response?.data?.message || "Erreur lors de la vérification"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (isCheckingAuth) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#F8FAFC'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si pas d'utilisateur (après vérification), retourner null
  if (!utilisateur) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <ElevationScroll>
        <AppBar position="fixed" color="transparent">
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
                <Box sx={{ bgcolor: '#2979FF', p: 0.8, borderRadius: 1.5, display: 'flex' }}>
                  <Shield sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5, fontStyle: 'italic' }}>
                  Protected <Box component="span" sx={{ color: '#2979FF' }}>Consulting</Box>
                </Typography>
              </Box>
              <Button 
                startIcon={<Logout />} 
                onClick={handleLogout}
                sx={{ fontWeight: 700, textTransform: 'none', color: 'inherit' }}
              >
                Déconnexion
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>

      <Box sx={{ 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: 'white',
        pt: 15, pb: 10,
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={900} sx={{ mb: 1 }}>Tableau de Bord</Typography>
          <Typography variant="h6" sx={{ opacity: 0.7 }}>Espace de gestion et signature sécurisée</Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8, pb: 10 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: 5, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 100, height: 100, mx: 'auto', mb: 2, 
                  background: 'linear-gradient(45deg, #2979FF, #00E676)',
                  fontSize: '2rem', fontWeight: 'bold'
                }}
              >
                {utilisateur.prenom?.[0] || ''}{utilisateur.nom?.[0] || ''}
              </Avatar>
              <Typography variant="h5" fontWeight={800}>{utilisateur.prenom} {utilisateur.nom}</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>{utilisateur.email}</Typography>
              <Chip 
                icon={<VerifiedUser sx={{ fontSize: '1rem !important' }}/>} 
                label="ID Vérifié par ANSI" 
                sx={{ bgcolor: '#F0F7FF', color: '#2979FF', fontWeight: 700, borderRadius: 1.5 }}
              />
              <Divider sx={{ my: 4, opacity: 0.6 }} />
              <Stack spacing={2} textAlign="left">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#F1F5F9', color: '#475569', width: 35, height: 35 }}>
                    <AccountCircle fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">NUMÉRO CIN</Typography>
                    <Typography fontWeight={700}>{utilisateur.cin}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: utilisateur.mfaActive ? '#ECFDF5' : '#FFF1F2', color: utilisateur.mfaActive ? '#059669' : '#E11D48', width: 35, height: 35 }}>
                    <Security fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">SÉCURITÉ 2FA</Typography>
                    <Typography fontWeight={700}>{utilisateur.mfaActive ? 'Activé' : 'Désactivé'}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              <Card sx={{ borderRadius: 5, border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilePresent color="primary" /> Signature & Vérification
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Le document est haché localement (SHA-256). Signez-le puis vérifiez son intégrité.
                  </Typography>

                  <Box 
                    component="label"
                    sx={{ 
                      mt: 2, p: 6, border: '2px dashed #CBD5E1', borderRadius: 4, 
                      bgcolor: '#F8FAFC', textAlign: 'center', cursor: 'pointer',
                      display: 'block', transition: '0.3s',
                      '&:hover': { bgcolor: '#F0F7FF', borderColor: '#2979FF' }
                    }}
                  >
                    <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
                    {!file ? (
                      <>
                        <CloudUpload sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                        <Typography variant="h6" fontWeight={700}>Glissez-déposez votre PDF</Typography>
                        <Typography variant="body2" color="text.secondary">Ou cliquez pour parcourir</Typography>
                      </>
                    ) : (
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <CheckCircle color="success" sx={{ fontSize: 32 }} />
                        <Box textAlign="left">
                          <Typography fontWeight={800}>{file.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Typography>
                        </Box>
                      </Stack>
                    )}
                  </Box>

                  {(loading || isSigning || isVerifying) && <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />}

                  {hash && (
                    <Box sx={{ mt: 4 }}>
                      <Alert severity="info" icon={<Fingerprint sx={{ color: '#2979FF' }} />} sx={{ borderRadius: 3, bgcolor: '#F0F7FF', border: '1px solid #BBDEFB', mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={800} color="#1A237E">Empreinte numérique (Hash) :</Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', mt: 1, color: '#2979FF', fontWeight: 600 }}>
                          {hash}
                        </Typography>
                      </Alert>

                      <Stack direction="row" spacing={2}>
                        {!signatureDone ? (
                          <Button 
                            variant="contained" 
                            fullWidth 
                            size="large" 
                            startIcon={<Fingerprint />}
                            onClick={handleSignerDocument}
                            disabled={isSigning}
                            sx={{ py: 2, borderRadius: 3, fontWeight: 800, textTransform: 'none', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}
                          >
                            {isSigning ? 'Signature en cours...' : 'Signer avec certificat'}
                          </Button>
                        ) : (
                          <Button 
                            variant="outlined" 
                            fullWidth 
                            size="large" 
                            color="secondary"
                            startIcon={<Security />}
                            onClick={handleVerifierDocument}
                            disabled={isVerifying}
                            sx={{ py: 2, borderRadius: 3, fontWeight: 800, textTransform: 'none', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                          >
                            {isVerifying ? 'Vérification...' : 'Vérifier l\'intégrité'}
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  )}

                  {/* Affichage du résultat de la vérification */}
                  {verificationResult && (
                    <Alert 
                      severity={verificationResult.valide ? "success" : "error"} 
                      icon={verificationResult.valide ? <TaskAlt /> : <ErrorOutline />}
                      sx={{ mt: 4, borderRadius: 3, border: '1px solid' }}
                    >
                      <Typography fontWeight={700}>{verificationResult.message}</Typography>
                    </Alert>
                  )}

                  {signatureDone && !verificationResult && (
                    <Alert severity="success" sx={{ mt: 4, borderRadius: 3 }}>
                      Document signé avec succès ! Vous pouvez maintenant tester la vérification.
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <History /> Activité Récente
                </Typography>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: 'transparent', borderStyle: 'dashed' }}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {signatureDone ? `Dernière action : Signature de ${file?.name}` : "Aucun document signé récemment."}
                  </Typography>
                </Paper>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;