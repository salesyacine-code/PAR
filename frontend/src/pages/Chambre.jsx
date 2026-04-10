import React, { useState } from 'react';
import ChambreRow from './ChambreRow';
// Imports Material UI
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  MenuItem,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const Chambre = ({ chambres, refresh }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newChambre, setNewChambre] = useState({ numero: '', capacite: '', service: '' });

  // Filtrage des chambres pour la recherche
  const filteredChambres = chambres.filter(c => 
    c.numero.toString().includes(searchTerm) || 
    c.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddChambre = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/chambres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChambre)
      });
      if (res.ok) {
        refresh();
        setOpen(false);
        setNewChambre({ numero: '', capacite: '', service: '' });
      }
    } catch (err) {
      console.error("Erreur creation:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* HEADER AVEC RECHERCHE ET BOUTON MUI */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <TextField
          placeholder="Rechercher..."
          size="small"
          className="bg-white w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px', bgcolor: '#4f46e5' }}
        >
          Ajouter une chambre
        </Button>
      </div>

      {/* TABLEAU */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
            <th className="p-4 text-center">N° Chambre</th>
            <th className="p-4">Occupation</th>
            <th className="p-4">Patients</th>
            <th className="p-4 text-center">Statut</th>
          </tr>
        </thead>
        <tbody>
          {filteredChambres.map(c => (
            <ChambreRow 
              key={c.id} 
              chambre={c} 
              onActionSuccess={refresh} 
            />
          ))}
        </tbody>
      </table>

      {/* MODAL MUI (DIALOG) */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle className="font-bold text-slate-800">Nouvelle Chambre</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <div className="flex flex-col gap-4 mt-2">
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
              <MenuItem value="Cardiologie">Cardiologie</MenuItem>
              <MenuItem value="Urgences">Urgences</MenuItem>
              <MenuItem value="Réanimation">Réanimation</MenuItem>
            </TextField>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setOpen(false)} color="inherit">Annuler</Button>
          <Button onClick={handleAddChambre} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Chambre;