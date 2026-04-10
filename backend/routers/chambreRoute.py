from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Chambre
from schemas.chambre import ChambreResponse, ChambreCreate

# On garde le préfixe /chambres
router = APIRouter(prefix="/chambres", tags=["Chambres"])

@router.get("/", response_model=List[ChambreResponse])
def get_chambres(db: Session = Depends(get_db)):
    return db.query(Chambre).all()

@router.post("/create", response_model=ChambreResponse)
def create_chambre(data: ChambreCreate, db: Session = Depends(get_db)):
    # On vérifie si ce numéro existe DÉJÀ spécifiquement dans CE service
    exist_chambre = db.query(Chambre).filter(
        Chambre.numero == data.numero,
        Chambre.service == data.service
    ).first()
    
    if exist_chambre:
        # Message d'erreur plus précis pour l'utilisateur
        raise HTTPException(
            status_code=400, 
            detail=f"La chambre n°{data.numero} existe déjà dans le service {data.service}."
        )
    
    new_chambre = Chambre(
        numero=data.numero, 
        capacite=data.capacite, 
        service=data.service
    )
    
    db.add(new_chambre)
    db.commit()
    db.refresh(new_chambre)
    return new_chambre