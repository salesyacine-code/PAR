import React, { useState } from 'react';
import { 
  Card, Typography, Grid, CardActionArea, Box, Button,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, 
  MenuItem, Alert, CircularProgress, Snackbar, Fade 
} from '@mui/material';
import { 
  Favorite, Emergency, MedicalServices, BabyChangingStation, Vaccines,
  Add as AddIcon 
} from '@mui/icons-material';


import { createChambre } from '../Api';
const servicesMedicaux = [
  { id: 'Cardiologie', nom: 'Cardiologie', icone: <Favorite sx={{ fontSize: 40, color: '#ef4444' }} />, color: '#fee2e2' },
  { id: 'Urgences', nom: 'Urgences', icone: <Emergency sx={{ fontSize: 40, color: '#f59e0b' }} />, color: '#fef3c7' },
  { id: 'Réanimation', nom: 'Réanimation', icone: <MedicalServices sx={{ fontSize: 40, color: '#06b6d4' }} />, color: '#ecfeff' },
  { id: 'Pédiatrie', nom: 'Pédiatrie', icone: <BabyChangingStation sx={{ fontSize: 40, color: '#ec4899' }} />, color: '#fce7f3' },
  { id: 'Orthopédie', nom: 'Orthopédie', icone: <Vaccines sx={{ fontSize: 40, color: '#10b981' }} />, color: '#d1fae5' },
];

export default function ServiceGrid({ onServiceClick, refresh }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newChambre, setNewChambre] = useState({ numero: '', capacite: '', service: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const validate = () => {
    let tempErrors = {};
    if (!newChambre.numero.trim()) tempErrors.numero = "Le numéro est obligatoire";
    if (!newChambre.capacite || newChambre.capacite <= 0) tempErrors.capacite = "La capacité doit être > 0";
    if (!newChambre.service) tempErrors.service = "Veuillez sélectionner un service";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddChambre = async () => {
    if (!validate()) {
      setSnackbar({ open: true, message: "Le formulaire contient des erreurs", severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await createChambre(newChambre);
      setSnackbar({ open: true, message: 'Chambre ajoutée avec succès !', severity: 'success' });
      if (refresh) refresh();
      handleClose();
    } catch (err) {
      setSnackbar({ open: true, message: 'Erreur lors de l\'ajout de la chambre', severity: 'error' });
    } finally {
      setLoading(false);
    }


     
  };

  const handleClose = () => {
    setOpen(false);
    setNewChambre({ numero: '', capacite: '', service: '' });
    setErrors({});
  };

  return (
    <>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Changé en haut à droite pour plus de visibilité
        TransitionComponent={Fade}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" elevation={6}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4, pr: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 600, 
            borderRadius: '10px', 
            bgcolor: '#4f46e5',
            px: 3,
            boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
            '&:hover': { bgcolor: '#4338ca' }
          }}
        >
          Nouvelle Chambre
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ p: 2 }}>
        {servicesMedicaux.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card sx={{ 
              borderRadius: 4, 
              border: '1px solid #e2e8f0',
              boxShadow: 'none',
              transition: 'all 0.2s ease-in-out', 
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              } 
            }}>
              <CardActionArea onClick={() => onServiceClick(service.id)} sx={{ p: 4 }}>
                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: '16px', 
                    bgcolor: service.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {service.icone}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {service.nom}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
          📦 Ajouter une chambre
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              label="Numéro de chambre"
              placeholder="Ex: 101-A"
              fullWidth
              variant="outlined"
              error={!!errors.numero}
              helperText={errors.numero}
              value={newChambre.numero}
              onChange={(e) => {
                setNewChambre({...newChambre, numero: e.target.value});
                if(errors.numero) setErrors(prev => ({...prev, numero: null}));
              }}
            />
            <TextField
              label="Capacité (Nombre de lits)"
              type="number"
              fullWidth
              error={!!errors.capacite}
              helperText={errors.capacite}
              value={newChambre.capacite}
              onChange={(e) => {
                setNewChambre({...newChambre, capacite: e.target.value});
                if(errors.capacite) setErrors(prev => ({...prev, capacite: null}));
              }}
            />
            <TextField
              select
              label="Assigner à un Service"
              fullWidth
              error={!!errors.service}
              helperText={errors.service}
              value={newChambre.service}
              onChange={(e) => {
                setNewChambre({...newChambre, service: e.target.value});
                if(errors.service) setErrors(prev => ({...prev, service: null}));
              }}
            >
              {servicesMedicaux.map((s) => (
                <MenuItem key={s.id} value={s.id} sx={{ fontWeight: 500 }}>
                  {s.nom}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 600 }}>
            Annuler
          </Button>
          <Button 
            onClick={handleAddChambre} 
            variant="contained" 
            disabled={loading}
            sx={{ 
              bgcolor: '#4f46e5', 
              fontWeight: 600,
              borderRadius: '8px',
              minWidth: 120,
              '&:hover': { bgcolor: '#4338ca' }
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}