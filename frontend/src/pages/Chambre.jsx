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

       
      </div>

      {/* TABLEAU */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
            <th className="p-4 text-center">N° Chambre</th>
              <th className="p-4 text-center">Service</th>
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
      
    </div>
  );
};

export default Chambre;