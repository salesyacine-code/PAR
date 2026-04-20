import React, { useState } from 'react';
import { 
  Checkbox, IconButton, Tooltip, Typography, Chip, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Delete, Hotel } from '@mui/icons-material';
import {deletePatient} from '../Api';
export default function PatientRow({ patient, chambres, onActionSuccess, isSelected, onSelect }) {
 
 
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const chambreActuelle = chambres.find(c => c.id === patient.chambre_id);

  /**
   * Logique de suppression réelle
   */
  const confirmDelete = async () => {
    setLoading(true);
    setOpenConfirm(false);
    try {
      await deletePatient(patient.id);
      onActionSuccess();
    } catch (err) {
      setErrorMsg('Erreur lors de la suppression du patient');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <tr className={`hover:bg-slate-50 transition-colors border-b border-slate-100 ${isSelected ? 'bg-indigo-50/50' : ''}`}>
        <td className="p-4 text-center">
          <Checkbox 
            size="small"
            checked={isSelected} 
            onChange={onSelect}
            sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#4f46e5' } }}
          />
        </td>

        <td className="p-4">
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
            {patient.nom} 
          </Typography>
        </td>
        <td className="p-4">  
          <Typography variant="body2" sx={{ color: '#475569' }}>
            {patient.age} ans
          </Typography>
        </td>
        <td className="p-4">  
          <Typography variant="body2" sx={{ color: '#475569' }}>
            {patient.sexe}
          </Typography>
        </td>
        
        <td className="p-4">
          <Chip 
            label={patient.specialite || 'Général'} 
            size="small" 
            sx={{ fontSize: '11px', fontWeight: 'bold', bgcolor: '#f1f5f9', color: '#475569', borderRadius: '6px' }} 
          />
        </td>

        <td className="p-4">
          {chambreActuelle ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Hotel sx={{ fontSize: 18, color: '#6366f1' }} />
              <Box>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: '#1e293b', lineHeight: 1.2 }}>
                  Chambre {chambreActuelle.numero}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '10px' }}>
                  {chambreActuelle.service}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
              Non assigné
            </Typography>
          )}
        </td>

        <td className="p-4 text-right">
          <Tooltip title="Supprimer définitivement">
            <IconButton 
              onClick={() => setOpenConfirm(true)}
              disabled={loading}
              size="small"
              sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' } }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : <Delete fontSize="small" />}
            </IconButton>
          </Tooltip>
        </td>
      </tr>

      {/* --- COMPOSANTS DE FEEDBACK (Hors du flux du tableau) --- */}

      {/* 1. Modal de confirmation de suppression */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer le dossier de <strong>{patient.nom}</strong> ? 
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. Notification d'erreur (Snackbar) */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={5000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%', fontWeight: 'bold' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  );
}