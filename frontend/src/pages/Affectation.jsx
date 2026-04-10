import React, { useState } from 'react';

const Affectation = ({ patients, chambres }) => {
  const [serviceSelectionne, setServiceSelectionne] = useState(null);

  // Groupement des données par service
  const statsParService = chambres.reduce((acc, chambre) => {
    const srv = chambre.service || "Général";
    if (!acc[srv]) {
      acc[srv] = { nom: srv, nbChambres: 0, capaciteTotale: 0, patients: [] };
    }
    acc[srv].nbChambres += 1;
    acc[srv].capaciteTotale += chambre.capacite;
    acc[srv].patients.push(...chambre.patients);
    return acc;
  }, {});

  const services = Object.values(statsParService);

  // Si un service est cliqué, on affiche le détail
  if (serviceSelectionne) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setServiceSelectionne(null)}
          className="text-indigo-600 font-semibold flex items-center gap-2 hover:underline"
        >
          ← Retour aux services
        </button>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-indigo-900 text-white">
            <h2 className="text-2xl font-bold">{serviceSelectionne.nom}</h2>
            <p className="opacity-80">{serviceSelectionne.patients.length} Patients actuellement hospitalisés</p>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Spécialité</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serviceSelectionne.patients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium">{p.nom}</td>
                  <td className="p-4 text-sm text-slate-500">{p.specialite}</td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 text-sm font-bold">Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Gestion des Services</h1>
        <p className="text-slate-500">Sélectionnez un département pour voir les affectations.</p>
      </header>

      {/* GRID DES SERVICES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div 
            key={service.nom}
            onClick={() => setServiceSelectionne(service)}
            className="group cursor-pointer bg-white rounded-3xl border-2 border-transparent hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <span className="text-3xl">🏥</span>
              </div>
              <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                Actif
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{service.nom}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Occupation</span>
                <span className="font-bold text-slate-700">
                  {Math.round((service.patients.length / service.capaciteTotale) * 100)}%
                </span>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-500" 
                  style={{ width: `${(service.patients.length / service.capaciteTotale) * 100}%` }}
                ></div>
              </div>

              <p className="text-sm text-slate-400">
                {service.patients.length} patients / {service.nbChambres} chambres
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Affectation;