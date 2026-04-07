from pydantic import BaseModel
from typing import List
from .patient import PatientResponse

class ChambreBase(BaseModel):
    numero: str
    capacite: int

class ChambreCreate(ChambreBase):
    pass

class ChambreResponse(ChambreBase):
    id: int
    patients: List[PatientResponse] = [] # Relation inverse automatique

    class Config:
        from_attributes = True