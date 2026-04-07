from database import SessionLocal, engine
import models

def clear_db():
    db = SessionLocal()
    try:
        # Supprime le contenu de chaque table
        db.query(models.Patient).delete()
        db.query(models.Chambre).delete()
        
        db.commit()
        print("✅ Base de données vidée avec succès (Tables conservées).")
    except Exception as e:
        db.rollback()
        print(f"❌ Erreur : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_db()