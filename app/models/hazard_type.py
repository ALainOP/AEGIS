from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class HazardType(Base):
    __tablename__ = "hazard_type"

    hazard_type_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    hazard_level = Column(String(50))
    description = Column(Text)