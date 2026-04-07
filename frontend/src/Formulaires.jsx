import { useState } from "react";

export default function Formulaires({ onRefresh }) {
  const [nom, setNom] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [numeroChambre, setNumeroChambre] = useState("");
  const [capacite, setCapacite] = useState(2);

  // Ajouter un Patient
  const ajouterPatient = async (e) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, specialite }),
    });
    setNom(""); setSpecialite("");
    onRefresh(); // Rafraîchit la liste globale
  };

  // Ajouter une Chambre
  const ajouterChambre = async (e) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/chambres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero: numeroChambre, capacite: parseInt(capacite) }),
    });
    setNumeroChambre("");
    onRefresh();
  };

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "30px", padding: "20px", background: "#f4f4f4" }}>
      
      {/* Formulaire Patient */}
      <form onSubmit={ajouterPatient} style={{ flex: 1 }}>
        <h3>Ajouter un Patient</h3>
        <input placeholder="Nom du patient" value={nom} onChange={e => setNom(e.target.value)} required />
        <input placeholder="Spécialité" value={specialite} onChange={e => setSpecialite(e.target.value)} required />
        <button type="submit">Créer Patient</button>
      </form>

      {/* Formulaire Chambre */}
      <form onSubmit={ajouterChambre} style={{ flex: 1 }}>
        <h3>Ajouter une Chambre</h3>
        <input placeholder="N° Chambre (ex: 101)" value={numeroChambre} onChange={e => setNumeroChambre(e.target.value)} required />
        <input type="number" placeholder="Capacité" value={capacite} onChange={e => setCapacite(e.target.value)} required />
        <button type="submit">Créer Chambre</button>
      </form>
      
    </div>
  );
}