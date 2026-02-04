import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Badge,
  Phone,
  Business,
  CheckCircle,
  ContentCopy
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Indispensable pour le MFA
import authService from '../../services/authService';

const steps = ['Informations personnelles', 'Coordonnées', 'Sécurité'];

const validationSchema = Yup.object({
  prenom: Yup.string().required('Requis').min(2),
  nom: Yup.string().required('Requis').min(2),
  cin: Yup.string().required('Requis').matches(/^\d{8}$/, '8 chiffres requis'),
  dateNaissance: Yup.date().required('Requis'),
  civilite: Yup.string().required('Requis'),
  email: Yup.string().required('Requis').email('Email invalide'),
  telephone: Yup.string().required('Requis').matches(/^(\+216)?[0-9]{8}$/, 'Numéro invalide'),
  adresse: Yup.string().required('Requis'),
  ville: Yup.string().required('Requis'),
  codePostal: Yup.string().required('Requis').matches(/^\d{4}$/, '4 chiffres'),
  motDePasse: Yup.string().required('Requis').min(8).matches(/[A-Z]/, 'Majuscule requise').matches(/[0-9]/, 'Chiffre requis'),
  confirmerMotDePasse: Yup.string().required('Requis').oneOf([Yup.ref('motDePasse')], 'Non identique'),
  conditionsAcceptees: Yup.boolean().oneOf([true], 'Obligatoire')
});

const Inscription: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  
  // États pour le MFA
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [openMfaModal, setOpenMfaModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      prenom: '', nom: '', cin: '', dateNaissance: '', civilite: '',
      email: '', telephone: '', adresse: '', ville: '', codePostal: '',
      motDePasse: '', confirmerMotDePasse: '', conditionsAcceptees: false,
    },
    validationSchema: validationSchema,
   onSubmit: async (values) => {
  setLoading(true);
  setErreur('');
  try {
    const result = await authService.inscrire(
      values.email, values.motDePasse, values.prenom, values.nom, 
      values.cin, values.telephone, values.dateNaissance, values.civilite,
      values.adresse, values.ville, values.codePostal
    );

    // TON BACKEND RENVOIE "succes: true" (voir ControleurAuthentification.java)
    if (result.succes) {
      alert("Inscription réussie ! Un code de vérification vous sera envoyé par email lors de votre première connexion.");
      navigate('/connexion'); 
    } else {
      setErreur(result.message || "Erreur lors de l'inscription");
    }
  } catch (error: any) {
    // Affiche le message d'erreur précis du Backend (ex: "Email déjà utilisé")
    setErreur(error.response?.data?.message || "Erreur de connexion");
  } finally {
    setLoading(false);
  }
},
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Fonction pour copier la clé manuelle (pour ceux sur PC sans téléphone)
  const copierCleManuelle = () => {
    const secret = new URL(qrCodeUrl).searchParams.get("secret");
    if (secret) {
      navigator.clipboard.writeText(secret);
      alert("Clé copiée !");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
            Créer un compte
          </Typography>
          <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
        </Box>

        {erreur && <Alert severity="error" sx={{ mb: 3 }}>{erreur}</Alert>}

        <form onSubmit={formik.handleSubmit}>
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Civilité" name="civilite" value={formik.values.civilite} onChange={formik.handleChange}>
                  <MenuItem value="Monsieur">Monsieur</MenuItem>
                  <MenuItem value="Madame">Madame</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Prénom" name="prenom" value={formik.values.prenom} onChange={formik.handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Nom" name="nom" value={formik.values.nom} onChange={formik.handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="CIN" name="cin" value={formik.values.cin} onChange={formik.handleChange} inputProps={{maxLength: 8}} /></Grid>
              <Grid item xs={12}><TextField fullWidth type="date" label="Date de naissance" name="dateNaissance" InputLabelProps={{shrink: true}} value={formik.values.dateNaissance} onChange={formik.handleChange} /></Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Téléphone" name="telephone" value={formik.values.telephone} onChange={formik.handleChange} /></Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Adresse" name="adresse" value={formik.values.adresse} onChange={formik.handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Ville" name="ville" value={formik.values.ville} onChange={formik.handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Code Postal" name="codePostal" value={formik.values.codePostal} onChange={formik.handleChange} /></Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type={showPassword ? 'text' : 'password'} label="Mot de passe" name="motDePasse" value={formik.values.motDePasse} onChange={formik.handleChange}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                    </InputAdornment>
                  )}}
                />
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth type="password" label="Confirmer" name="confirmerMotDePasse" value={formik.values.confirmerMotDePasse} onChange={formik.handleChange} /></Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <input type="checkbox" name="conditionsAcceptees" checked={formik.values.conditionsAcceptees} onChange={formik.handleChange} />
                  <Typography variant="body2" sx={{ ml: 1 }}>J'accepte les conditions d'utilisation</Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>Retour</Button>
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : "S'inscrire"}</Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>Suivant</Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* --- DIALOG MFA (LE CŒUR DE LA SÉCURITÉ) --- */}
      <Dialog open={openMfaModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          🔒 Double Authentification
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Scannez ce code avec <b>Google Authenticator</b> :
          </Typography>
          
          <Box sx={{ p: 2, bgcolor: 'white', display: 'inline-block', border: '1px solid #ddd', borderRadius: 2, my: 2 }}>
            <QRCodeCanvas value={qrCodeUrl} size={180} />
          </Box>

          <Divider sx={{ my: 2 }}>OU (Pour PC sans téléphone)</Divider>

          <Typography variant="caption" color="text.secondary" display="block">
            Copiez cette clé dans votre application d'authentification PC :
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1, p: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
              {qrCodeUrl ? new URL(qrCodeUrl).searchParams.get("secret") : ''}
            </Typography>
            <IconButton size="small" onClick={copierCleManuelle}><ContentCopy fontSize="small" /></IconButton>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 3, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/connexion')}>
            J'ai configuré mon code, me connecter
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Inscription;