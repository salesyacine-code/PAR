import React from 'react';

export default function ChambreRow({ chambre, onActionSuccess }) {
  const occupation = chambre.patients?.length || 0;
  const estPleine = occupation >= chambre.capacite;

  const libererPatient = async (pId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/patients/liberer/${pId}`, { method: "put" });
      if (res.ok) onActionSuccess();
    } catch (err) {
      console.error("Erreur libération", err);
    }
  };

  return (
    <tr className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
      <td className="p-4 font-bold text-slate-700 text-center">
        {chambre.numero}
      </td>
      <td className="p-4 text-center text-slate-600">
        {chambre.service}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
            <div 
              className={`h-2 rounded-full ${estPleine ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${(occupation / chambre.capacite) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium text-slate-600">
            {occupation} / {chambre.capacite}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-2">
          {chambre.patients?.length > 0 ? (
            chambre.patients.map(p => (
              <span key={p.id} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs border border-indigo-100">
                {p.nom}
                <button 
                  onClick={() => libererPatient(p.id)}
                  className="hover:text-red-600 ml-1 font-bold"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-xs italic">Chambre vide</span>
          )}
        </div>
      </td>
      <td className="p-4 text-center">
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          estPleine ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
        }`}>
          {estPleine ? 'Pleine' : 'Disponible'}
        </span>
      </td>
    </tr>
  );
}