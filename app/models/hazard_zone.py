from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from geoalchemy2 import Geometry
from app.database import Base


class HazardZone(Base):
    __tablename__ = "hazard_zone"

    zone_id = Column(Integer, primary_key=True)

    hazard_type_id = Column(
        Integer,
        ForeignKey("hazard_type.hazard_type_id"),
        nullable=False
    )

    source_id = Column(
        Integer,
        ForeignKey("data_source.source_id")
    )

    zone_name = Column(String(150), nullable=False)

    boundary = Column(
        Geometry(
            geometry_type="POLYGON",
            srid=4326
        )
    )

    intensity_level = Column(Numeric(5, 2))
    risk_score = Column(Numeric(5, 2))
    last_updated = Column(DateTime)