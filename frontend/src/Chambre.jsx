export default function chambre({ chambre, onActionSuccess }) {
  
  const libererPatient = async (pId) => {
    try {
      await fetch(`http://127.0.0.1:8000/patients/liberer/${pId}`, { method: "PUT" });
      onActionSuccess(); // Rafraîchissement global
    } catch (err) {
      console.error("Erreur libération", err);
    }
  };

  return (
    <div style={{ border: "2px solid #2ecc71", padding: "10px", borderRadius: "8px" }}>
      <h4>Chambre {chambre.numero}</h4>
      <ul>
        {chambre.patients.map(p => (
          <li key={p.id}>
            {p.nom} <button onClick={() => libererPatient(p.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}