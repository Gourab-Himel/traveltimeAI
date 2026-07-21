from sqlalchemy import Column, Integer, String, DECIMAL, Date, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(191), nullable=False)
    email = Column(String(191), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now())

class Crop(Base):
    __tablename__ = "crops"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(191))
    field = Column(String(191))
    area_hectares = Column(DECIMAL(10, 4))
    created_at = Column(DateTime, default=func.now())

class Batch(Base):
    __tablename__ = "batches"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(191), unique=True)
    product = Column(String(191))
    quantity = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())

