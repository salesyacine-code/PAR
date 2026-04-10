# models.py
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    
    # --- Nouvelles colonnes pour le Solver ---
    age = Column(Integer, nullable=False)
    genre = Column(String, nullable=False) # 'M' ou 'F'
    
    # Degré d'urgence (1: Stable, 5: Critique)
    urgence = Column(Integer, default=1) 
    
    # Niveau de compétence requis (correspond au 'Skill level' du dataset)
    skill_requis = Column(Integer, default=1) 
    
    specialite = Column(String, nullable=True)
    
    # Relation avec la chambre
    chambre_id = Column(Integer, ForeignKey("chambres.id"), nullable=True)
    chambre = relationship("Chambre", back_populates="patients")

class Chambre(Base):
    __tablename__ = "chambres"

    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String, unique=True, nullable=False)
    capacite = Column(Integer, default=2)
    service = Column(String, nullable=True)
    
    # --- Colonnes stratégiques ---
    # Pour la contrainte de non-mixité : 'M', 'F' ou 'Mixte'
    # Dans le dataset, cela peut évoluer selon le premier occupant
    genre_attribue = Column(String, default="Mixte") 
    
    # Relation vers les patients
    patients = relationship("Patient", back_populates="chambre")

class Infirmier(Base):
    __tablename__ = "infirmiers"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    
    # Niveau de compétence (doit être >= au skill_requis du patient)
    skill_level = Column(Integer, default=1)
    
    # Pour gérer les "infirmiers coupables" (exclusions)
    # On pourrait ajouter une table de jointure pour les incompatibilités
    est_disponible = Column(Boolean, default=True)
