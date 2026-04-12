from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base

class Chambre(Base):
    __tablename__ = "chambres"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String)
    capacite = Column(Integer, default=2)
    service = Column(String)
    patients = relationship("Patient", back_populates="chambre")
    __table_args__ = (UniqueConstraint('numero', 'service', name='_numero_service_uc'),)

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String)
    age=Column(Integer)
    sexe = Column(String)
    specialite = Column(String) 
    chambre_id = Column(Integer, ForeignKey("chambres.id"), nullable=True)
    chambre = relationship("Chambre", back_populates="patients")