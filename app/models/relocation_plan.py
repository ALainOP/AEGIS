from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base


class RelocationPlan(Base):
    __tablename__ = "relocation_plan"

    plan_id = Column(Integer, primary_key=True)

    habitation_id = Column(
        Integer,
        ForeignKey("habitation.habitation_id"),
        nullable=False
    )

    site_id = Column(
        Integer,
        ForeignKey("relocation_site.site_id"),
        nullable=False
    )

    planned_households = Column(Integer)
    status = Column(String(50))
    plan_date = Column(Date)
    relocation_phase = Column(String(50))

    approved_by = Column(
        Integer,
        ForeignKey("sdma_user.user_id")
    )