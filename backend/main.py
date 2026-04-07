from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import patientRoute , chambreRoute 

# Création des tables au démarrage
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hôpital API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes
app.include_router(patientRoute.router)
app.include_router(chambreRoute.router)

@app.get("/")
def root():
    return {"message": "API Hospital v1.0"}