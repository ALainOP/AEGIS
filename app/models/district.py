from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class District(Base):
    __tablename__ = "district"

    district_id = Column(Integer, primary_key=True)
    state_id = Column(
        Integer,
        ForeignKey("state.state_id"),
        nullable=False
    )
    name = Column(String(100), nullable=False)