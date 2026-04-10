from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Patient, Chambre
from schemas.patient import PatientCreate, PatientResponse
from schemas.chambre import ChambreResponse
from algo import solver

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("/", response_model=PatientResponse)
def create_patient(data: PatientCreate, db: Session = Depends(get_db)):
    new_p = Patient(**data.model_dump())
   
    existing_patient = db.query(Patient).filter_by(nom=new_p.nom).first()
    if existing_patient:
        raise HTTPException(status_code=400, detail="Patient déjà existant")
        

    db.add(new_p)
    db.commit()
    db.refresh(new_p)
    return new_p

@router.get("/", response_model=List[PatientResponse])
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()


@router.put("/{p_id}/assigner/{c_id}", response_model=PatientResponse)
def assign_patient(p_id: int, c_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).get(p_id)
    chambre = db.query(Chambre).get(c_id)
    
    if not patient or not chambre:
        raise HTTPException(status_code=404, detail="Introuvable")
    if len(chambre.patients) >= chambre.capacite:
        raise HTTPException(status_code=400, detail="Chambre pleine")
        
    patient.chambre_id = c_id
    db.commit()
    return patient


@router.put("/liberer/{p_id}", response_model=PatientResponse)
def liberer_patient(p_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).get(p_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    
    patient.chambre_id = None
    db.commit()
    return patient

@router.delete("/delete/{p_id}", response_model=PatientResponse)
def delete_patient(p_id:int, db: Session = Depends(get_db)):
    patient = db.query(Patient).get(p_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    if patient.chambre_id is not None:
        raise HTTPException(status_code=400, detail="Libérez d'abord la chambre du patient")
    
    db.delete(patient)
    db.commit()
    return patient





@router.post("/assign-group")
def assign_group_of_patients(patient_ids: List[int], db: Session = Depends(get_db)):
    # 1. Récupérer uniquement les patients non encore affectés parmi la sélection
    # (ou tous si tu permets la ré-affectation)
    patients_to_assign = db.query(Patient).filter(
        Patient.id.in_(patient_ids),
        Patient.chambre_id == None  # On ne traite que ceux qui attendent une chambre
    ).all()
    
    if not patients_to_assign:
        return {"status": "info", "message": "Aucun patient à affecter"}

    # 2. Récupérer l'état actuel de toutes les chambres
    chambres = db.query(Chambre).all()
    
    # 3. L'ALGORITHME (Solver)
    # On passe les objets SQLAlchemy directement
    results = solver.assign_batch(patients_to_assign, chambres)
    
    # 4. Enregistrement (L'algorithme a déjà modifié les objets en mémoire)
    db.commit()
    
    return {
        "status": "success", 
        "assigned_count": len(results),
        "assignments": results # Ex: {patient_id: chambre_id}
    }