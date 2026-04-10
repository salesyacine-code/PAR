import React, { useState } from 'react'; // Ajout de useState ici
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CardActionArea, 
  Box, 
  Button,
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  MenuItem
} from '@mui/material';
import { 
  Favorite, 
  Emergency, 
  MedicalServices, 
  BabyChangingStation, 
  Vaccines,
  Add as AddIcon 
} from '@mui/icons-material';

const servicesMedicaux = [
  { id: 'Cardiologie', nom: 'Cardiologie', icone: <Favorite sx={{ fontSize: 40, color: '#ef4444' }} />, color: '#fee2e2' },
  { id: 'Urgences', nom: 'Urgences', icone: <Emergency sx={{ fontSize: 40, color: '#f59e0b' }} />, color: '#fef3c7' },
  { id: 'Réanimation', nom: 'Réanimation', icone: <MedicalServices sx={{ fontSize: 40, color: '#06b6d4' }} />, color: '#ecfeff' },
  { id: 'Pédiatrie', nom: 'Pédiatrie', icone: <BabyChangingStation sx={{ fontSize: 40, color: '#ec4899' }} />, color: '#fce7f3' },
  { id: 'Orthopédie', nom: 'Orthopédie', icone: <Vaccines sx={{ fontSize: 40, color: '#10b981' }} />, color: '#d1fae5' },
];

// On ajoute 'refresh' dans les props pour mettre à jour la liste après ajout
export default function ServiceGrid({ onServiceClick, refresh }) {
  const [open, setOpen] = useState(false);
  const [newChambre, setNewChambre] = useState({ numero: '', capacite: '', service: '' });

  const handleAddChambre = async () => {
    // On s'assure que les types sont corrects (string pour numero, int pour capacite)
    const payload = {
      numero: String(newChambre.numero),
      capacite: parseInt(newChambre.capacite) || 0,
      service: newChambre.service
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/chambres/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        if (refresh) refresh(); // On appelle le fetch global de App.jsx
        setOpen(false);
        setNewChambre({ numero: '', capacite: '', service: '' });
      } else {
        const error = await res.json();
        console.error("Erreur validation:", error);
      }
    } catch (err) {
      console.error("Erreur reseau:", err);
    }
  };

  return (
    <>
      {/* Bouton Ajouter positionné en haut à droite */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, pr: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 'bold', 
            borderRadius: '8px', 
            bgcolor: '#4f46e5',
            '&:hover': { bgcolor: '#4338ca' }
          }}
        >
          Ajouter une chambre
        </Button>
      </Box>

      {/* Grille des Services */}
      <Grid container spacing={3} sx={{ p: 2 }}>
        {servicesMedicaux.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card 
              sx={{ 
                borderRadius: 4, 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <CardActionArea onClick={() => onServiceClick(service.id)} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 2, borderRadius: '50%', bgcolor: service.color, display: 'flex' }}>
                    {service.icone}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                    {service.nom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gérer les hospitalisations
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialogue d'ajout */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>Nouvelle Chambre</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Numéro de chambre"
              fullWidth
              value={newChambre.numero}
              onChange={(e) => setNewChambre({...newChambre, numero: e.target.value})}
            />
            <TextField
              label="Capacité (Lits)"
              type="number"
              fullWidth
              value={newChambre.capacite}
              onChange={(e) => setNewChambre({...newChambre, capacite: e.target.value})}
            />
            <TextField
              select
              label="Service"
              fullWidth
              value={newChambre.service}
              onChange={(e) => setNewChambre({...newChambre, service: e.target.value})}
            >
              {servicesMedicaux.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.nom}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Annuler</Button>
          <Button onClick={handleAddChambre} variant="contained" sx={{ bgcolor: '#4f46e5' }}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}