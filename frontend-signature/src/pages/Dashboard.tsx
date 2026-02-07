import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Button, Paper, Box, Grid,
  Avatar, Divider, Chip, Card, CardContent, Alert,
  AppBar, Toolbar, useScrollTrigger, Stack,
  CircularProgress, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogContentText, TextField, DialogActions
} from '@mui/material';
import {
  Logout, Shield, History, FilePresent, TaskAlt, 
  Download, PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import CryptoJS from 'crypto-js';
import axios from 'axios';

// URL DE VOTRE BACKEND SUR RENDER
const API_BASE_URL = "https://version-dockerfile.onrender.com";

function ElevationScroll(props: any) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
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

  // États du document
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  const [signatureDone, setSignatureDone] = useState(false);
  
  // États de l'historique
  const [historique, setHistorique] = useState<any[]>([]);

  // ÉTATS POUR L'INVITATION
  const [openInvite, setOpenInvite] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // 1. Fonction de chargement de l'historique corrigée avec l'URL Render
  const loadHistorique = useCallback(async (userId: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userId) return;

      const response = await axios.get(`${API_BASE_URL}/api/signature/historique/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setHistorique(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Erreur lors du chargement de l'historique:", err);
    }
  }, []);

  // 2. Initialisation
  useEffect(() => {
    const initDashboard = async () => {
      const user = authService.getUtilisateurCourant();
      const userId = user?.id || user?._id;

      if (!user || !userId) {
        navigate('/connexion');
        return;
      }

      setUtilisateur(user);
      await loadHistorique(userId);
      setIsCheckingAuth(false);
    };

    initDashboard();
  }, [navigate, loadHistorique]);

  // FONCTION TÉLÉCHARGEMENT corrigée avec l'URL Render
  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/signature/telecharger/${docId}`, {
        responseType: 'blob',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'document_signe.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Impossible de télécharger le fichier.");
    }
  };

  // --- FONCTION INVITATION CORRIGÉE avec l'URL Render ---
  const handleSendInvite = async () => {
    if (!inviteEmail || !selectedDocId) return;
    
    const documentData = historique.find(d => d.id === selectedDocId);
    const fileNameToSend = documentData ? documentData.fileName : "Document";

    setIsSendingInvite(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/signature/inviter`, {
        documentId: selectedDocId,
        fileName: fileNameToSend,
        email: inviteEmail
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      alert(response.data.message || "Invitation envoyée avec succès !");
      setOpenInvite(false);
      setInviteEmail("");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erreur : Utilisateur introuvable ou erreur serveur.";
      alert(msg);
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleLogout = () => {
    authService.deconnecter();
    navigate('/connexion');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSignatureDone(false);
      const reader = new FileReader();
      reader.onload = (event) => {
        const binary = event.target?.result;
        if (binary) {
          const wa = CryptoJS.lib.WordArray.create(binary as any);
          setHash(CryptoJS.SHA256(wa).toString());
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  // FONCTION SIGNATURE corrigée avec l'URL Render
  const handleSignerDocument = async () => {
    const userId = utilisateur?.id || utilisateur?._id;
    if (!hash || !file || !userId) return;

    setIsSigning(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = (reader.result as string).split(',')[1];
        const token = localStorage.getItem('token'); 
        await axios.post(`${API_BASE_URL}/api/signature/signer`, {
          hash: hash, 
          fileName: file.name, 
          userId: userId,
          fileBase64: base64File
        }, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });

        setSignatureDone(true);
        await loadHistorique(userId);
      };
    } catch (error) {
      alert("Erreur lors de la signature.");
    } finally {
      setIsSigning(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <ElevationScroll>
        <AppBar position="fixed" color="transparent">
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, cursor: 'pointer', color: '#1A237E' }} onClick={() => navigate('/')}>
                Protected <Box component="span" sx={{ color: '#2979FF' }}>Consulting</Box>
              </Typography>
              <Button startIcon={<Logout />} onClick={handleLogout} sx={{ fontWeight: 700, textTransform: 'none' }}>
                Déconnexion
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>

      <Box sx={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', pt: 15, pb: 10, clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={900}>Tableau de Bord</Typography>
          <Typography variant="h6" sx={{ opacity: 0.7 }}>Bienvenue, {utilisateur?.prenom} {utilisateur?.nom}</Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8, pb: 10 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: 5, textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, background: 'linear-gradient(45deg, #2979FF, #00E676)' }}>
                {utilisateur?.prenom?.[0]}{utilisateur?.nom?.[0]}
              </Avatar>
              <Typography variant="h6" fontWeight={800}>{utilisateur?.prenom} {utilisateur?.nom}</Typography>
              <Chip label="Identité Vérifiée" color="success" size="small" sx={{ mt: 1, fontWeight: 700 }} />
              <Divider sx={{ my: 3 }} />
              <Stack spacing={1} textAlign="left">
                <Typography variant="caption" color="text.secondary">Email: <b>{utilisateur?.email}</b></Typography>
                <Typography variant="caption" color="text.secondary">CIN: <b>{utilisateur?.cin}</b></Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              <Card sx={{ borderRadius: 5, p: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} gutterBottom>
                    <FilePresent color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} /> 
                    Nouveau Scellement
                  </Typography>
                  <Box component="label" sx={{ mt: 2, p: 4, border: '2px dashed #CBD5E1', borderRadius: 4, textAlign: 'center', display: 'block', cursor: 'pointer', transition: '0.3s', '&:hover': { bgcolor: '#F1F5F9' } }}>
                    <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
                    {!file ? (
                      <Typography color="text.secondary">Cliquez pour ajouter un document PDF</Typography>
                    ) : (
                      <Typography fontWeight={700} color="primary">{file.name}</Typography>
                    )}
                  </Box>

                  {hash && (
                    <Box sx={{ mt: 3 }}>
                      {!signatureDone ? (
                        <Button variant="contained" fullWidth onClick={handleSignerDocument} disabled={isSigning} sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}>
                          {isSigning ? <CircularProgress size={24} color="inherit" /> : 'Signer numériquement'}
                        </Button>
                      ) : (
                        <Alert icon={<TaskAlt />} severity="success" sx={{ borderRadius: 3 }}>
                          Document signé avec succès et archivé.
                        </Alert>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>

              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <History /> Historique des documents
                </Typography>
                <Stack spacing={2}>
                  {historique.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="body2" color="text.secondary">Aucun document dans votre coffre-fort.</Typography>
                    </Paper>
                  ) : (
                    historique.map((doc, i) => (
                      <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s', '&:hover': { boxShadow: 2, borderColor: '#2979FF' } }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: '#F0F9FF' }}><FilePresent sx={{ color: '#0284C7' }} /></Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700}>{doc.fileName}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(doc.timestamp).toLocaleString()}</Typography>
                          </Box>
                        </Stack>
                        
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" color="primary" title="Inviter quelqu'un" onClick={() => { setSelectedDocId(doc.id); setOpenInvite(true); }}>
                            <PersonAdd fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="info" title="Télécharger" onClick={() => handleDownload(doc.id, doc.fileName)}>
                            <Download fontSize="small" />
                          </IconButton>
                          <Chip label="SCELLÉ" size="small" color="success" variant="outlined" sx={{ fontWeight: 800 }} />
                        </Stack>
                      </Paper>
                    ))
                  )}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* MODAL D'INVITATION */}
      <Dialog open={openInvite} onClose={() => setOpenInvite(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Partager le document</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Saisissez l'email de la personne pour l'autoriser à consulter ce document.
          </DialogContentText>
          <TextField
            autoFocus
            label="Email de l'invité"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenInvite(false)} color="inherit">Annuler</Button>
          <Button 
            onClick={handleSendInvite} 
            variant="contained" 
            disabled={!inviteEmail || isSendingInvite}
            startIcon={isSendingInvite ? <CircularProgress size={20} /> : <PersonAdd />}
          >
            Envoyer l'accès
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;