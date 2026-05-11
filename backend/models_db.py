from sqlalchemy import Boolean, CheckConstraint, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
import datetime

from database import Base
from labels import FRACTURE_CLASSES

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, default="Utilisateur")
    role = Column(String, default="user") # 'user' ou 'admin'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    predictions = relationship("PredictionHistory", back_populates="owner")


_PREDICTED_CLASS_SQL = ", ".join(f"'{c}'" for c in FRACTURE_CLASSES)


class PredictionHistory(Base):
    __tablename__ = "predictions"
    __table_args__ = (
        CheckConstraint(
            f"predicted_class IN ({_PREDICTED_CLASS_SQL})",
            name="ck_predictions_predicted_class_weber",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    predicted_class = Column(String)
    confidence = Column(Float)
    filename = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="predictions")
