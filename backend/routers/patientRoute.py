from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Patient, Chambre
from schemas.patient import PatientCreate, PatientResponse

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("/", response_model=PatientResponse)
def create_patient(data: PatientCreate, db: Session = Depends(get_db)):
    new_p = Patient(**data.model_dump())
    db.add(new_p)
    db.commit()
    db.refresh(new_p)
    return new_p

@router.get("/", response_model=List[PatientResponse])
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

# Route d'assignation placée ici car elle modifie un Patient
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
    
    db.delete(patient)
    db.commit()
    return patient