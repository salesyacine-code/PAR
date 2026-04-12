from pydantic import BaseModel
from typing import List, Optional

class PatientInChambre(BaseModel):
    id: int
    nom: str
    specialite: Optional[str] = None
    
    class Config:
        from_attributes = True

class ChambreBase(BaseModel):
    numero: str
    capacite: int
    service: Optional[str] = None # Accepter None au cas où

class ChambreCreate(ChambreBase):
    pass

class ChambreResponse(ChambreBase):
    id: int
    # Utilise la version simplifiée ou assure-toi que List[] est bien géré
    patients: List[PatientInChambre] = [] 

    class Config:
        from_attributes = True