from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from io import BytesIO
from PIL import Image
import torch
from typing import List

import models_db, schemas, auth
from database import engine, get_db
from model import FractureModel
from utils import transform_image

# Création des tables dans la base de données
models_db.Base.metadata.create_all(bind=engine)

app = FastAPI(title="OrthoVision API - Malleolar Fracture Classification")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation du modèle (bouchon)
model = FractureModel()
model.eval()

CLASSES = ["Weber A", "Weber B", "Weber C", "Bimalleolar", "Trimalleolar", "Maisonneuve", "Osteochondral"]

# ================= AUTH ROUTES =================

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models_db.User).filter(models_db.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email déjà enregistré")
    
    # Par défaut, le premier utilisateur créé ou tout utilisateur via l'API publique est 'user'
    hashed_password = auth.get_password_hash(user.password)
    new_user = models_db.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role="user" 
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models_db.User).filter(models_db.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models_db.User = Depends(auth.get_current_user)):
    return current_user

# ================= CORE ROUTES =================

@app.post("/predict")
async def predict_fracture(
    file: UploadFile = File(...), 
    current_user: models_db.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Format non supporté. (PNG, JPG)")

    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents)).convert("RGB")
        tensor_image = transform_image(image)
        
        with torch.no_grad():
            outputs = model(tensor_image.unsqueeze(0))
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            top_prob, top_class_idx = torch.max(probabilities, dim=0)
            
            predicted_class = CLASSES[top_class_idx.item()]
            confidence = top_prob.item()
            all_probs = {CLASSES[i]: float(probabilities[i]) for i in range(len(CLASSES))}
            
        # Sauvegarde en base de données
        db_prediction = models_db.PredictionHistory(
            user_id=current_user.id,
            predicted_class=predicted_class,
            confidence=confidence,
            filename=file.filename
        )
        db.add(db_prediction)
        db.commit()
            
        return {
            "prediction": predicted_class,
            "confidence": confidence,
            "probabilities": all_probs
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/my-predictions", response_model=List[schemas.PredictionResponse])
def get_my_predictions(current_user: models_db.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    predictions = db.query(models_db.PredictionHistory).filter(models_db.PredictionHistory.user_id == current_user.id).all()
    return predictions

# ================= ADMIN ROUTES =================

@app.get("/admin/users", response_model=List[schemas.UserResponse])
def get_all_users(admin_user: models_db.User = Depends(auth.get_current_admin_user), db: Session = Depends(get_db)):
    users = db.query(models_db.User).all()
    return users

@app.get("/admin/predictions", response_model=List[schemas.PredictionResponse])
def get_all_predictions(admin_user: models_db.User = Depends(auth.get_current_admin_user), db: Session = Depends(get_db)):
    predictions = db.query(models_db.PredictionHistory).all()
    return predictions

# --- Nouvelles routes Admin ---

@app.post("/admin/users", response_model=schemas.UserResponse)
def admin_create_user(user: schemas.UserCreateAdmin, admin_user: models_db.User = Depends(auth.get_current_admin_user), db: Session = Depends(get_db)):
    db_user = db.query(models_db.User).filter(models_db.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email déjà enregistré")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models_db.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.put("/admin/users/{user_id}", response_model=schemas.UserResponse)
def admin_update_user(user_id: int, user_update: schemas.UserUpdate, admin_user: models_db.User = Depends(auth.get_current_admin_user), db: Session = Depends(get_db)):
    db_user = db.query(models_db.User).filter(models_db.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    if user_update.email:
        db_user.email = user_update.email
    if user_update.full_name:
        db_user.full_name = user_update.full_name
    if user_update.role:
        db_user.role = user_update.role
    if user_update.password:
        db_user.hashed_password = auth.get_password_hash(user_update.password)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/admin/users/{user_id}")
def admin_delete_user(user_id: int, admin_user: models_db.User = Depends(auth.get_current_admin_user), db: Session = Depends(get_db)):
    db_user = db.query(models_db.User).filter(models_db.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    if db_user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Vous ne pouvez pas supprimer votre propre compte admin")
    
    db.delete(db_user)
    db.commit()
    return {"message": "Utilisateur supprimé"}

@app.delete("/admin/predictions/{prediction_id}")
def admin_delete_prediction(prediction_id: int, admin_user: models_db.User = Depends(auth.get_current_admin_user), db: Session = Depends(get_db)):
    db_prediction = db.query(models_db.PredictionHistory).filter(models_db.PredictionHistory.id == prediction_id).first()
    if not db_prediction:
        raise HTTPException(status_code=404, detail="Prédiction non trouvée")
    
    db.delete(db_prediction)
    db.commit()
    return {"message": "Prédiction supprimée"}
