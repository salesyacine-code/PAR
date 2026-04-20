import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/Layout";
import Patient from "./pages/Patient"; 
import Chambre from "./pages/Chambre"; 
import Personnel from "./pages/Personnel";
import ServiceGrid from "./pages/ServiceGrid";
import { ArrowBack } from "@mui/icons-material";
import { Button, Typography, Box } from "@mui/material";
import {getPatients, getChambres} from './Api';
function App() {
 
  const [data, setData] = useState({ patients: [], chambres: [] });
  const [view, setView] = useState('grid'); // 'grid' ou 'chambres'
  const [selectedService, setSelectedService] = useState(null);

  const fetchAll = async () => {
    try {
      const [patientsRes, chambresRes] = await Promise.all([getPatients(), getChambres()]);
      setData({ patients: patientsRes.data, chambres: chambresRes.data });
    } catch (err) {
      console.error("Erreur lors du chargement des données", err);
    }
  };

  useEffect(() => { 
    fetchAll(); 
  }, []);

  // --- FONCTION AJOUTÉE : Gère le clic sur un service ---
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setView('chambres');
  };

  return (
    <MainLayout>
      <Routes>
        {/* ACCUEIL */}
        <Route path="/" element={
          <Box className="p-6">
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
              Dashboard Accueil
            </Typography>
            <Typography sx={{ color: '#64748b', mt: 2 }}>
              Bienvenue dans le gestionnaire hospitalier. Sélectionnez une option dans le menu.
            </Typography>
          </Box>
        } />

        {/* PAGE PATIENTS */}
        <Route path="/patients" element={
          <Patient
            patients={data.patients} 
            chambres={data.chambres} 
            refresh={fetchAll} 
          />
        } />
        
        {/* PAGE CHAMBRES (Navigation Grille <-> Liste) */}
        <Route path="/chambres" element={
          <div className="p-8 bg-slate-50 min-h-screen">
            {view === 'chambres' && (
              <Button 
                startIcon={<ArrowBack />} 
                onClick={() => setView('grid')}
                variant="outlined"
                sx={{ mb: 3, borderRadius: '10px', textTransform: 'none' }}
              >
                Retour aux services
              </Button>
            )}

            <Typography 
              variant="h3" 
              align="center" 
              sx={{ fontWeight: 900, color: '#1e293b', mb: 6 }}
            >
              {view === 'grid' ? "Unités d'Hospitalisation" : `Service : ${selectedService}`}
            </Typography>

            {view === 'grid' ? (
              <ServiceGrid onServiceClick={handleServiceSelect}  refresh={fetchAll} />
            ) : (
              <Chambre 
                // On passe les chambres filtrées directement au composant
                chambres={data.chambres.filter(c => c.service === selectedService)} 
                refresh={fetchAll}
                currentService={selectedService}
              />
            )}
          </div>
        } />

        <Route path="/personnel" element={<Personnel />} />
      </Routes>
    </MainLayout>
  );
}

export default App;