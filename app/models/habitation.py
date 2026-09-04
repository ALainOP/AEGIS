from sqlalchemy import Column, Integer, String, Numeric
from geoalchemy2 import Geography
from app.database import Base


class Habitation(Base):
    __tablename__ = "habitation"

    habitation_id = Column(Integer, primary_key=True)

    district_id = Column(
        Integer,
        nullable=False
    )

    name = Column(String(150), nullable=False)

    population = Column(Integer)

    households = Column(Integer)

    location = Column(
        Geography(
            geometry_type="POINT",
            srid=4326
        )
    )

    area_sqkm = Column(Numeric(10, 2))

    infrastructure_score = Column(Numeric(5, 2))