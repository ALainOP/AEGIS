from sqlalchemy import Column, Integer, Numeric, String, ForeignKey
from app.database import Base


class CarryingCapacity(Base):
    __tablename__ = "carrying_capacity"

    capacity_id = Column(Integer, primary_key=True)

    site_id = Column(
        Integer,
        ForeignKey("relocation_site.site_id"),
        nullable=False,
        unique=True
    )

    planned_capacity = Column(Integer)
    max_households = Column(Integer)

    water_availability = Column(Numeric(5, 2))

    environmental_clearance_status = Column(String(50))