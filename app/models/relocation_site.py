from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from geoalchemy2 import Geography
from app.database import Base


class RelocationSite(Base):
    __tablename__ = "relocation_site"

    site_id = Column(Integer, primary_key=True)

    district_id = Column(
        Integer,
        ForeignKey("district.district_id")
    )

    name = Column(String(150), nullable=False)

    available_area_sqkm = Column(Numeric(10, 2))
    land_ownership = Column(String(100))

    location = Column(
        Geography(
            geometry_type="POINT",
            srid=4326
        )
    )

    suitability_score = Column(Numeric(5, 2))