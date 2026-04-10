from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Chambre
from schemas.chambre import ChambreResponse, ChambreCreate

router = APIRouter(prefix="/chambres", tags=["Chambres"])

@router.get("/", response_model=List[ChambreResponse])
def get_chambres(db: Session = Depends(get_db)):
    return db.query(Chambre).all()

@router.post("/", response_model=ChambreResponse)
def create_chambre(data: ChambreCreate, db: Session = Depends(get_db)):
    new_chambre = Chambre(numero=data.numero, capacite=data.capacite)
    exist_chambre=db.query(Chambre).filter_by(numero=new_chambre.numero).first()
    if exist_chambre:
        raise HTTPException(status_code=400, detail="Chambre déjà existante")
    db.add(new_chambre)
    db.commit()
    db.refresh(new_chambre)
    return new_chambre

