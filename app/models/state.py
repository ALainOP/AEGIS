from sqlalchemy import Column, Integer, String
from app.database import Base


class State(Base):
    __tablename__ = "state"

    state_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    region = Column(String(100))