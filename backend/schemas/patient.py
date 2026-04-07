from pydantic import BaseModel
from typing import Optional

class PatientBase(BaseModel):
    nom: str
    specialite: str

class PatientCreate(PatientBase):
    pass  # Utilisé pour le POST

class PatientResponse(PatientBase):
    id: int
    chambre_id: Optional[int] = None

    class Config:
        from_attributes = True