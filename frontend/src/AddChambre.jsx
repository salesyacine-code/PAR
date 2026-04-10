import { useState } from "react";

export default function AddChambreForm({ onChambreAdded }) {
  const [numero, setNumero] = useState("");
  const [capacite, setCapacite] = useState(2);
  const [service, setService] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/chambres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero, capacite: parseInt(capacite) , service: service}),
    });
    setNumero("");
    setService("");
    onChambreAdded();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Nouvelle Chambre</h3>
      <input value={numero} onChange={e => setNumero(e.target.value)} placeholder="N° Chambre" required />
      <input type="number" value={capacite} onChange={e => setCapacite(e.target.value)} min="1" required />
      <input type="text" value={service} onChange={e => setService(e.target.value)} placeholder="Service" required />
      <button type="submit">Créer</button>
    </form>
  );
}

const formStyle = { border: "1px dashed #2ecc71", padding: "15px", marginBottom: "20px" };