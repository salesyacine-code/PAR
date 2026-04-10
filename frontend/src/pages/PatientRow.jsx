import React from 'react';
import { 
  Checkbox, 
  Select, 
  MenuItem, 
  IconButton, 
  Tooltip,
  Typography,
  Chip
} from '@mui/material';
import { Delete, Hotel } from '@mui/icons-material';

export default function PatientRow({ patient, chambres, onActionSuccess, isSelected, onSelect }) {
  
  const handleAssign = async (chambreId) => {
    if (!chambreId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/patients/${patient.id}/assigner/${chambreId}`, { 
        method: "PUT" 
      });
      if (res.ok) onActionSuccess();
    } catch (err) {
      console.error("Erreur d'assignation", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer le patient ${patient.nom} ?`)) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/patients/delete/${patient.id}`, { 
        method: "DELETE" 
      });
      if (res.ok) onActionSuccess();
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  return (
    <tr className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50/50' : ''}`}>
      <td className="p-4">
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
        <Chip 
          label={patient.specialite || 'Général'} 
          size="small" 
          sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: '#f1f5f9', color: '#475569' }} 
        />
      </td>

      <td className="p-4">
        <Select
          value={patient.chambre_id || ""}
          onChange={(e) => handleAssign(e.target.value)}
          displayEmpty
          size="small"
          variant="standard"
          disableUnderline
          sx={{ fontSize: '13px', color: '#4f46e5', fontWeight: 'bold' }}
          startAdornment={<Hotel sx={{ fontSize: 16, mr: 1, color: '#94a3b8' }} />}
        >
          <MenuItem value="">
            <em className="text-slate-400 not-italic text-xs">Non assigné</em>
          </MenuItem>
          {chambres.map(c => (
            <MenuItem key={c.id} value={c.id} sx={{ fontSize: '13px' }}>
              Chambre {c.numero} ({c.service || 'Sans service'})
            </MenuItem>
          ))}
        </Select>
      </td>

      <td className="p-4 text-right">
        <Tooltip title="Supprimer">
          <IconButton 
            onClick={handleDelete}
            size="small"
            sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' } }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </td>
    </tr>
  );
}