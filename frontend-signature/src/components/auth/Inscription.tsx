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
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ContentCopy
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import authService from '../../services/authService';

const steps = ['Informations personnelles', 'Coordonnées', 'Sécurité'];

// Schéma de validation Yup
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
  
  // États pour le MFA (au cas où votre backend renverrait un secret dès l'inscription)
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

      // --- LOGS DE DÉBOGAGE : OBJET ENVOYÉ AU BACKEND ---
      const payload = {
        email: values.email,
        motDePasse: values.motDePasse,
        prenom: values.prenom,
        nom: values.nom,
        cin: values.cin,
        telephone: values.telephone,
        dateNaissance: values.dateNaissance,
        civilite: values.civilite,
        adresse: values.adresse,
        ville: values.ville,
        codePostal: values.codePostal
      };
      
      console.log("---------- DEBUG INSCRIPTION ----------");
      console.log("URL API:", import.meta.env.VITE_API_URL || 'http://localhost:8080/api');
      console.log("Payload envoyé (JSON):", JSON.stringify(payload, null, 2));
      console.log("---------------------------------------");

      try {
        const result = await authService.inscrire(
          values.email, values.motDePasse, values.prenom, values.nom, 
          values.cin, values.telephone, values.dateNaissance, values.civilite,
          values.adresse, values.ville, values.codePostal
        );

        console.log("Réponse du serveur:", result);

        if (result.succes || result.id) {
          alert("Inscription réussie ! Connectez-vous pour continuer.");
          navigate('/connexion'); 
        } else {
          setErreur(result.message || "Erreur lors de l'inscription");
        }
      } catch (error: any) {
        // Log détaillé de l'erreur 400 ou autre
        console.error("Erreur API complète:", error);
        if (error.response) {
            console.error("Détails erreur backend (Data):", error.response.data);
            console.error("Status erreur:", error.response.status);
            setErreur(error.response.data?.message || `Erreur ${error.response.status}: Données invalides`);
        } else {
            setErreur("Impossible de contacter le serveur.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const copierCleManuelle = () => {
    try {
        const secret = new URL(qrCodeUrl).searchParams.get("secret");
        if (secret) {
          navigator.clipboard.writeText(secret);
          alert("Clé copiée !");
        }
    } catch(e) {
        console.error("Impossible de lire le secret QR");
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
                <TextField 
                    select fullWidth label="Civilité" name="civilite" 
                    value={formik.values.civilite} onChange={formik.handleChange}
                    error={formik.touched.civilite && Boolean(formik.errors.civilite)}
                >
                  <MenuItem value="Monsieur">Monsieur</MenuItem>
                  <MenuItem value="Madame">Madame</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Prénom" name="prenom" value={formik.values.prenom} onChange={formik.handleChange} error={formik.touched.prenom && Boolean(formik.errors.prenom)}/></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Nom" name="nom" value={formik.values.nom} onChange={formik.handleChange} error={formik.touched.nom && Boolean(formik.errors.nom)}/></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="CIN" name="cin" value={formik.values.cin} onChange={formik.handleChange} inputProps={{maxLength: 8}} error={formik.touched.cin && Boolean(formik.errors.cin)}/></Grid>
              <Grid item xs={12}><TextField fullWidth type="date" label="Date de naissance" name="dateNaissance" InputLabelProps={{shrink: true}} value={formik.values.dateNaissance} onChange={formik.handleChange} error={formik.touched.dateNaissance && Boolean(formik.errors.dateNaissance)}/></Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} error={formik.touched.email && Boolean(formik.errors.email)}/></Grid>
              <Grid item xs={12}><TextField fullWidth label="Téléphone" name="telephone" value={formik.values.telephone} onChange={formik.handleChange} error={formik.touched.telephone && Boolean(formik.errors.telephone)}/></Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Adresse" name="adresse" value={formik.values.adresse} onChange={formik.handleChange} error={formik.touched.adresse && Boolean(formik.errors.adresse)}/></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Ville" name="ville" value={formik.values.ville} onChange={formik.handleChange} error={formik.touched.ville && Boolean(formik.errors.ville)}/></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Code Postal" name="codePostal" value={formik.values.codePostal} onChange={formik.handleChange} error={formik.touched.codePostal && Boolean(formik.errors.codePostal)}/></Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth type={showPassword ? 'text' : 'password'} label="Mot de passe" name="motDePasse" 
                  value={formik.values.motDePasse} onChange={formik.handleChange}
                  error={formik.touched.motDePasse && Boolean(formik.errors.motDePasse)}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                    </InputAdornment>
                  )}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                    fullWidth type="password" label="Confirmer" name="confirmerMotDePasse" 
                    value={formik.values.confirmerMotDePasse} onChange={formik.handleChange}
                    error={formik.touched.confirmerMotDePasse && Boolean(formik.errors.confirmerMotDePasse)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <input type="checkbox" name="conditionsAcceptees" checked={formik.values.conditionsAcceptees} onChange={formik.handleChange} />
                  <Typography variant="body2" sx={{ ml: 1 }}>J'accepte les conditions d'utilisation</Typography>
                </Box>
                {formik.touched.conditionsAcceptees && formik.errors.conditionsAcceptees && (
                    <Typography color="error" variant="caption">{formik.errors.conditionsAcceptees}</Typography>
                )}
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

      {/* --- DIALOG MFA (Configuré par le backend) --- */}
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
          <Divider sx={{ my: 2 }}>OU (Clé manuelle)</Divider>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1, p: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
               {qrCodeUrl ? "Secret détecté" : "Aucun secret"}
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