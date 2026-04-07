import { useState } from "react";

export default function AddPatientForm({ onPatientAdded }) {
  const [nom, setNom] = useState("");
  const [specialite, setSpecialite] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, specialite }),
      });
      if (response.ok) {
        setNom(""); setSpecialite("");
        onPatientAdded(); // On dit à App.js de recharger la liste
      }
    } catch (err) {
      console.error("Erreur création patient", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Nouveau Patient</h3>
      <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom" required />
      <input value={specialite} onChange={e => setSpecialite(e.target.value)} placeholder="Spécialité" required />
      <button type="submit">Ajouter</button>
    </form>
  );
}

const formStyle = { border: "1px dashed #666", padding: "15px", marginBottom: "20px" };