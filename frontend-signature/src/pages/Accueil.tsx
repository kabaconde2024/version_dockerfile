import React from 'react';
import monImage from './ima.jpg';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  AppBar, 
  Toolbar, 
  useScrollTrigger,
  Stack,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Security, Speed, VerifiedUser, Lock, 
  Login, Fingerprint, Description,
  CloudUpload, Shield, CheckCircleOutline,
  ArrowForward
} from '@mui/icons-material';

// Effet d'élévation de la Navbar au scroll
function ElevationScroll(props: any) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    style: {
      backgroundColor: trigger ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      backdropFilter: trigger ? 'blur(10px)' : 'none',
      color: trigger ? '#1A237E' : 'white',
      transition: 'all 0.3s ease-in-out'
    }
  });
}

const Accueil: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: '#2979FF' }} />,
      title: "MFA de Grade Bancaire",
      description: "Authentification multi-facteurs robuste pour chaque transaction."
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 40, color: '#00E676' }} />,
      title: "Conformité Mondiale",
      description: "Standard eIDAS, ESIGN et UETA pour une validité juridique globale."
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#FF9100' }} />,
      title: "Workflow Instantané",
      description: "Optimisez vos processus métier avec une signature en un clic."
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: '#F44336' }} />,
      title: "Cryptage Point-à-Point",
      description: "Chiffrement AES-256 bits pour une confidentialité absolue."
    }
  ];

  const steps = [
    { title: "Identité", desc: "Vérification sécurisée", icon: <Login /> },
    { title: "Dépôt", desc: "Upload PDF chiffré", icon: <CloudUpload /> },
    { title: "Sceau", desc: "Signature numérique", icon: <Fingerprint /> },
    { title: "Archivage", desc: "Récupération sécurisée", icon: <Description /> }
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      
      <ElevationScroll>
        <AppBar position="fixed" color="transparent">
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  bgcolor: '#2979FF', p: 0.8, borderRadius: 1.5, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Shield sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5, fontStyle: 'italic' }}>
                  Protected <Box component="span" sx={{ color: '#2979FF' }}>Consulting</Box>
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                onClick={() => navigate('/connexion')}
                sx={{ 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                  '&:hover': { boxShadow: '0 6px 20px rgba(0,118,255,0.23)' }
                }}
              >
                Accéder au Portail
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>

      {/* HERO SECTION */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: 'white',
        pt: { xs: 18, md: 24 },
        pb: { xs: 15, md: 20 },
        clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CheckCircleOutline sx={{ color: '#00E676', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ letterSpacing: 3, fontWeight: 600, opacity: 0.8 }}>
                  NEXT-GEN DIGITAL SIGNATURE
                </Typography>
              </Box>
              
              <Typography variant="h1" sx={{ 
                fontWeight: 900, 
                mb: 3,
                lineHeight: 1.1,
                fontSize: { xs: '3rem', md: '4.5rem' }
              }}>
                L'intégrité de vos <br />
                <Box component="span" sx={{ 
                  background: 'linear-gradient(to right, #38BDF8, #818CF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>documents mondiaux</Box>
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 6, opacity: 0.7, fontWeight: 400, maxWidth: '90%' }}>
                Rejoignez l'élite des entreprises qui automatisent leurs processus contractuels avec une sécurité cryptographique sans compromis.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/connexion')}
                  sx={{ 
                    bgcolor: '#2979FF', px: 5, py: 2, borderRadius: 3, fontWeight: 700,
                    fontSize: '1.1rem', textTransform: 'none'
                  }}
                >
                  Démarrer maintenant
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ 
                    color: 'white', borderColor: 'rgba(255,255,255,0.3)', 
                    px: 4, py: 2, borderRadius: 3, textTransform: 'none',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                >
                  Voir la démo
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Paper sx={{
                p: 1, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Box sx={{ 
                  p: 4, 
                  borderRadius: 8, 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.4)'
                }}>
                  <Typography variant="h6" sx={{ color: '#38BDF8', mb: 4, fontWeight: 700, textAlign: 'center', letterSpacing: 1 }}>
                    PROCESSUS DE CONFIANCE
                  </Typography>

                  <Stack spacing={3}>
                    {[
                      { step: "01", title: "Identité", desc: "Vérification biométrique", color: "#38BDF8", icon: <Login /> },
                      { step: "02", title: "Dépôt", desc: "Upload AES-256", color: "#818CF8", icon: <CloudUpload /> },
                      { step: "03", title: "Sceau", desc: "Signature Qualifiée", color: "#C084FC", icon: <Fingerprint /> },
                      { step: "04", title: "Archivage", desc: "Coffre-fort Légal", color: "#2DD4BF", icon: <Description /> }
                    ].map((item, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 3,
                        p: 2,
                        borderRadius: 4,
                        transition: '0.3s',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', transform: 'translateX(10px)' }
                      }}>
                        <Avatar sx={{ 
                          bgcolor: 'transparent', 
                          border: `2px solid ${item.color}`, 
                          color: item.color,
                          fontWeight: 'bold',
                          width: 50, height: 50
                        }}>
                          {item.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'white' }}>
                            {item.step}. {item.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            {item.desc}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>

                {/* IMAGE UNIQUE - CENTRÉE ET AGRANDIE */}
<Box sx={{ 
  width: '100%', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center',
  mt: 6, // Plus d'espace avec le texte au-dessus
  px: 2  // Petit padding pour ne pas toucher les bords sur mobile
}}>
  <Box 
    component="img" 
    src={monImage} 
    alt="Processus de confiance"
    sx={{ 
      width: '100%', 
      maxWidth: '650px', // Agrandissement (était à 400px)
      height: 'auto',
      borderRadius: 6,   // Arrondi plus prononcé pour le style
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 20px rgba(56, 189, 248, 0.2)', // Effet néon bleu discret
      border: '1px solid rgba(255, 255, 255, 0.15)',
      transition: 'all 0.4s ease-in-out',
      '&:hover': {
        transform: 'scale(1.03)', // Effet de zoom léger au survol
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 30px rgba(56, 189, 248, 0.3)',
      }
    }}
  />
</Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Pensé pour l'excellence</Typography>
          <Typography variant="h6" color="text.secondary">Une technologie de pointe pour des signatures infalsifiables.</Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ 
                height: '100%', borderRadius: 5, p: 2, border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: '0.3s',
                '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 3, display: 'inline-flex', p: 2, bgcolor: '#F0F7FF', borderRadius: 4 }}>
                    {f.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{f.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* HOW IT WORKS */}
      <Box sx={{ bgcolor: '#F1F5F9', py: 15 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {steps.map((s, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ position: 'relative', textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 80, height: 80, borderRadius: 4, bgcolor: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 3, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    color: '#2979FF'
                  }}>
                    {s.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{s.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.desc}</Typography>
                  {i < 3 && (
                    <ArrowForward sx={{ 
                      display: { xs: 'none', md: 'block' },
                      position: 'absolute', top: 40, right: -20, color: '#CBD5E1' 
                    }} />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ bgcolor: '#0F172A', color: 'white', pt: 10, pb: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Protected Consulting</Typography>
              <Typography sx={{ opacity: 0.6 }}>
                Leader mondial de la confiance numérique. Nous sécurisons les échanges des entreprises les plus exigeantes.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography fontWeight={700} sx={{ mb: 2 }}>Produit</Typography>
              <Stack spacing={1} sx={{ opacity: 0.6 }}>
                <Typography variant="body2">Sécurité</Typography>
                <Typography variant="body2">API</Typography>
                <Typography variant="body2">Tarifs</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography fontWeight={700} sx={{ mb: 2 }}>Légal</Typography>
              <Stack spacing={1} sx={{ opacity: 0.6 }}>
                <Typography variant="body2">Confidentialité</Typography>
                <Typography variant="body2">RGPD</Typography>
                <Typography variant="body2">CGU</Typography>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.4 }}>
              © {new Date().getFullYear()} Protected Consulting Inc. Tous droits réservés.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Accueil;