from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ================= Users =================

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None

class UserCreateAdmin(UserCreate):
    role: str = "user"

# ================= Tokens =================

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# ================= Predictions =================

class PredictionBase(BaseModel):
    predicted_class: str
    confidence: float
    filename: str

class PredictionCreate(PredictionBase):
    pass

class PredictionResponse(PredictionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
