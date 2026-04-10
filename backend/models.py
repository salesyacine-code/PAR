from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Chambre(Base):
    __tablename__ = "chambres"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String, unique=True)
    capacite = Column(Integer, default=2)
    service = Column(String)
    patients = relationship("Patient", back_populates="chambre")

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String)
    specialite = Column(String) 
    chambre_id = Column(Integer, ForeignKey("chambres.id"), nullable=True)
    chambre = relationship("Chambre", back_populates="patients")