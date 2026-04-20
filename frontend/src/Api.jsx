import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Patients
export const getPatients = () => API.get("/patients/");
export const createPatient = (data) => API.post("/patients/", data);
export const assignPatient = (p_id, c_id) =>
  API.put(`/patients/assigner/${p_id}/${c_id}`);
export const libererPatient = (p_id) =>
  API.put(`/patients/liberer/${p_id}`);
export const deletePatient = (p_id) =>
  API.delete(`/patients/delete/${p_id}`);
export const bulkAssign = () =>
  API.put("/patients/assign");

// Chambres
export const getChambres = () => API.get("/chambres/");
export const createChambre = (data) =>
  API.post("/chambres/create", data);