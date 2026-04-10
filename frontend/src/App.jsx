import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/Layout";
import Patient from "./pages/Patient"; // C'est ton composant de ligne patient
import Chambre from "./pages/Chambre"; // C'est ton composant de carte chambre
import Personnel from "./pages/Personnel";

function App() {
  const [data, setData] = useState({ patients: [], chambres: [] });

  const fetchAll = async () => {
    try {
      const [resP, resC] = await Promise.all([
        fetch("http://127.0.0.1:8000/patients"),
        fetch("http://127.0.0.1:8000/chambres")
      ]);
      const patients = await resP.json();
      const chambres = await resC.json();
      setData({ patients, chambres });
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <MainLayout>
      <Routes>
        {/* ACCUEIL */}
        <Route path="/" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Accueil</h1>
            <p className="text-slate-500 mt-2">Sélectionnez une option dans le menu à gauche.</p>
          </div>
        } />

        {/* PAGE PATIENTS : On boucle sur la liste ici */}
      <Route path="/patients" element={
  <Patient
    patients={data.patients} 
    chambres={data.chambres} 
    refresh={fetchAll} 
  />
} />
       
        <Route path="/chambres" element={
          <Chambre chambres={data.chambres}
            refresh={fetchAll}
          />
        } />

        <Route path="/personnel" element={<Personnel />} />
      </Routes>
    </MainLayout>
  );
}

export default App;