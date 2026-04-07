import { useEffect, useState } from "react";
import Patient from "./Patient";
import Chambre from "./Chambre";
import AddPatientForm from "./AddPatient";
import AddChambreForm from "./AddChambre";

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
      console.error("Erreur de chargement :", error);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    // On utilise flex-direction: column pour que le titre soit en haut, puis les formulaires, puis les données
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      <h1>🏥 Dashboard Hôpital</h1>
      
      {/* ZONE DES FORMULAIRES : Alignés horizontalement */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
        <AddPatientForm onPatientAdded={fetchAll} />
        <AddChambreForm onChambreAdded={fetchAll} />
      </div>

      <hr style={{ width: "100%", border: "0.5px solid #eee" }} />

      {/* ZONE D'AFFICHAGE : Deux colonnes principales */}
      <div style={{ display: "flex", gap: "50px", alignItems: "flex-start" }}>
        
        {/* Colonne de gauche : Patients */}
        <section style={{ flex: 1 }}>
          <h2 style={{ borderBottom: "2px solid #3498db", paddingBottom: "10px" }}>Patients en attente</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
            {data.patients.filter(p => !p.chambre_id).map(p => (
              <Patient 
                key={p.id} 
                patient={p} 
                chambres={data.chambres} 
                onActionSuccess={fetchAll} 
              />
            ))}
          </div>
        </section>

        {/* Colonne de droite : Chambres */}
        <section style={{ flex: 2 }}>
          <h2 style={{ borderBottom: "2px solid #2ecc71", paddingBottom: "10px" }}>Chambres</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "15px" }}>
            {data.chambres.map(c => (
              <Chambre key={c.id} chambre={c} onActionSuccess={fetchAll} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default App;