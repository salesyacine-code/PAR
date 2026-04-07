import { useState } from "react";

export default function Patient({ patient, chambres, onActionSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const deletePatient =async(pId) => {
        try {
            await fetch(`http://127.0.0.1:8000/patients/delete/${pId}`, { method: "DELETE" });
            onActionSuccess(); // Rafraîchit la liste globale
        } catch (err) {
            console.error("Erreur libération", err);
        }
    }
  const handleAssign = async (chambreId) => {
    if (!chambreId) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://127.0.0.1:8000/patients/${patient.id}/assigner/${chambreId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Erreur lors de l'assignation");
      }

      // Succès : On prévient le parent de rafraîchir les données globales
      onActionSuccess(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", opacity: loading ? 0.6 : 1 }}>
      <strong>{patient.nom}</strong> <button onClick={() => deletePatient(patient.id)}>X</button>
      {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
      
      <select 
        disabled={loading}
        onChange={(e) => handleAssign(e.target.value)}
        value={patient.chambre_id || ""}
      >
        <option value="">Choisir une chambre...</option>
        {chambres.map(c => (
          <option key={c.id} value={c.id}>
            Chambre {c.numero} ({c.patients.length}/{c.capacite})
          </option>
        ))}
      </select>
    </div>
  );
}