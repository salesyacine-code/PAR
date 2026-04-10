import React, { useState } from 'react';
import PatientRow from './PatientRow';
// Imports Material UI
import { 
  Button, 
  Checkbox, 
  Badge, 
  TextField, 
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const PatientPage = ({ patients, chambres, refresh }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false); // État pour la Modal
  const [newPatient, setNewPatient] = useState({ nom: '', specialite: '' });

  // 1. Logique de recherche
  const filteredPatients = patients.filter(p => 
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.specialite?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Logique d'ajout
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
      }
    } catch (err) {
      console.error("Erreur creation patient:", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* SECTION RECHERCHE ET AJOUT */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Registre des Patients</h2>
          <p className="text-xs text-slate-500">{filteredPatients.length} patients affichés</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Champ de recherche MUI */}
          <TextField
            placeholder="Rechercher par nom ou spécialité..."
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

          {/* Bouton Ajouter MUI */}
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            onClick={() => setOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px', bgcolor: '#4f46e5' }}
          >
            Ajouter un patient
          </Button>

          {/* Bouton Algorithme (si sélection) */}
          {selectedIds.length > 0 && (
            <Button 
              variant="contained" 
              color="secondary"
              startIcon={<AutoFixHighIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
            >
              Assigner ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* TABLEAU DES PATIENTS */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
              <th className="p-4 w-10 text-center">Sélection</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Spécialité</th>
              <th className="p-4">Statut / Chambre</th>
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
                isSelected={selectedIds.includes(p.id)}
                onSelect={() => toggleSelect(p.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL D'AJOUT PATIENT (DIALOG MUI) */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle className="font-bold text-slate-800">Nouveau Patient</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <div className="flex flex-col gap-5 mt-2">
            <TextField
              label="Nom complet du patient"
              fullWidth
              value={newPatient.nom}
              onChange={(e) => setNewPatient({...newPatient, nom: e.target.value})}
            />
            
            <TextField
              select
              label="Spécialité médicale"
              fullWidth
              value={newPatient.specialite}
              onChange={(e) => setNewPatient({...newPatient, specialite: e.target.value})}
            >
              <MenuItem value="Cardiologie">Cardiologie</MenuItem>
              <MenuItem value="Urgences">Urgences</MenuItem>
              <MenuItem value="Réanimation">Réanimation</MenuItem>
              <MenuItem value="Neurologie">Neurologie</MenuItem>
            </TextField>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setOpen(false)} color="inherit">Annuler</Button>
          <Button onClick={handleAddPatient} variant="contained" sx={{ bgcolor: '#4f46e5' }}>
            Créer la fiche
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PatientPage;