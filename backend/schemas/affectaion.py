import datetime
from pydantic import BaseModel

class Affectation(BaseModel):
    patient_id: int
    chambre_id: int
    date_affectation: datetime.date = datetime.date.today()
    class Config:
        from_attributes = True  
        orm_mode = True
        

class AffectationCreate(BaseModel):
    patient_id: int
    chambre_id: int
    date_affectation: datetime.date = datetime.date.today()
    class Config:
        from_attributes = True  
        orm_mode = True


class AffectationUpdate(BaseModel):
    patient_id: int
    chambre_id: int
#     date_affectation: datetime.date = datetime.date.today()
    class Config:
        from_attributes = True  
        orm_mode = True