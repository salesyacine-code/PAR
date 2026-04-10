import React, { useState } from 'react';
import PatientRow from './PatientRow';
import { 
  Button, Checkbox, TextField, InputAdornment, Dialog, DialogTitle, 
  DialogContent, DialogActions, MenuItem, Typography, Box, Snackbar, Alert 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const Patient = ({ patients, chambres, refresh }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ nom: '', specialite: '' });
  
  // États pour remplacer les alertes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // 1. Filtrage des patients selon la recherche
  const filteredPatients = patients.filter(p => 
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.specialite?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Identifier les patients "Sélectionnables" (ceux SANS chambre)
  const selectablePatients = filteredPatients.filter(p => !p.chambre_id);

  const handleAddPatient = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient)
      });
      if (res.ok) {
        refresh();
        setOpen(false);
        setNewPatient({ nom: '', specialite: '' });
        setSnackbar({ open: true, message: 'Patient ajouté avec succès', severity: 'success' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Erreur lors de la création', severity: 'error' });
    }
  };

  const handleRunSolver = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/patients/assign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_ids: selectedIds })
      });

      if (res.ok) {
        refresh();
        setSelectedIds([]);
        setSnackbar({ 
          open: true, 
          message: `Optimisation terminée : ${selectedIds.length} patient(s) assigné(s).`, 
          severity: 'success' 
        });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Erreur lors de l\'optimisation', severity: 'error' });
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      // On ne sélectionne QUE les patients affichés qui n'ont pas de chambre
      setSelectedIds(selectablePatients.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Registre des Patients</h2>
          <p className="text-xs text-slate-500">{filteredPatients.length} patients au total</p>
        </div>

        <div className="flex items-center gap-3">
          <TextField
            placeholder="Rechercher..."
            size="small"
            variant="outlined"
            className="bg-white w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            onClick={() => setOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px', bgcolor: '#4f46e5' }}
          >
            Nouveau Patient
          </Button>

          {selectedIds.length > 0 && (
            <Button 
              variant="contained" 
              startIcon={<AutoFixHighIcon />}
              onClick={handleRunSolver}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px', bgcolor: '#9333ea', '&:hover': { bgcolor: '#7e22ce' } }}
            >
              Optimiser ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* TABLEAU */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
              <th className="p-4 w-12 text-center">
                <Checkbox 
                  size="small"
                  // Indéterminé si certains sélectionnables sont cochés mais pas tous
                  indeterminate={selectedIds.length > 0 && selectedIds.length < selectablePatients.length}
                  checked={selectablePatients.length > 0 && selectedIds.length === selectablePatients.length}
                  onChange={toggleSelectAll}
                  disabled={selectablePatients.length === 0}
                  sx={{ color: '#cbd5e1' }}
                />
              </th>
              <th className="p-4">Patient</th>
              <th className="p-4">Spécialité</th>
              <th className="p-4">Chambre Actuelle</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.map(p => (
              <PatientRow 
                key={p.id} 
                patient={p} 
                chambres={chambres} 
                onActionSuccess={refresh}
                // Si le patient a une chambre, on désactive sa sélection
                isSelected={selectedIds.includes(p.id)}
                onSelect={p.chambre_id ? null : () => toggleSelect(p.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* DIALOG AJOUT */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Ajouter un Patient</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-5 mt-4">
            <TextField
              label="Nom complet"
              fullWidth
              value={newPatient.nom}
              onChange={(e) => setNewPatient({...newPatient, nom: e.target.value})}
            />
            <TextField
              select
              label="Spécialité"
              fullWidth
              value={newPatient.specialite}
              onChange={(e) => setNewPatient({...newPatient, specialite: e.target.value})}
            >
              {["Urgences", "Cardiologie", "Réanimation", "Pédiatrie", "Orthopédie"].map(spec => (
                <MenuItem key={spec} value={spec}>{spec}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setOpen(false)} color="inherit">Annuler</Button>
          <Button onClick={handleAddPatient} variant="contained" sx={{ bgcolor: '#4f46e5' }}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR (REMPLACE ALERT) */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Patient;