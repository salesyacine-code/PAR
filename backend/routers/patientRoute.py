from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload, joinedload
from database import get_db
from models import Patient, Chambre
from schemas.patient import PatientCreate, PatientResponse
from schemas.chambre import ChambreResponse
from algo.solver import solver

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





# On définit un schéma plus simple pour l'auto-assignation (juste les IDs)
class AutoAssignRequest(BaseModel):
    patient_ids: List[int]
@router.put("/assign", response_model=dict)
def bulk_assign_with_solver(data: AutoAssignRequest, db: Session = Depends(get_db)):
    # 1. Récupération avec chargement des relations pour éviter les bugs dans l'algo
    patients_selectionnes = db.query(Patient).filter(Patient.id.in_(data.patient_ids)).all()
    # On charge les patients déjà en chambre pour que le solver calcule correctement l'espace
    toutes_les_chambres = db.query(Chambre).options(joinedload(Chambre.patients)).all()

    if not patients_selectionnes:
        raise HTTPException(status_code=404, detail="Aucun patient trouvé")

    try:
        # 2. APPEL DU SOLVER
        resultats = solver.resoudre(patients_selectionnes, toutes_les_chambres)

        # 3. Mise à jour en base
        for p_id, c_id in resultats.items():
            db.query(Patient).filter(Patient.id == p_id).update(
                {Patient.chambre_id: c_id},
                synchronize_session=False
            )
        
        db.commit()
        return {
            "status": "success",
            "count": len(resultats),
            "assignments": resultats
        }

    except Exception as e:
        db.rollback()
        # Affiche l'erreur réelle dans les logs pour débugger
        print(f"DEBUG SOLVER ERROR: {e}") 
        raise HTTPException(status_code=500, detail=f"Erreur du solver : {str(e)}")