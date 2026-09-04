from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):

    query = text("""
        SELECT
            (SELECT COUNT(*) FROM habitation) AS total_habitations,

            (SELECT COUNT(*)
             FROM relocation_priority
             WHERE priority_score >= 80) AS high_risk_habitations,

            (SELECT COALESCE(SUM(h.population), 0)
             FROM habitation h
             JOIN relocation_priority rp
               ON h.habitation_id = rp.habitation_id
             WHERE rp.priority_score >= 80) AS population_at_risk,

            (SELECT COUNT(*)
             FROM relocation_plan) AS total_relocation_plans,

            (SELECT COUNT(*)
             FROM relocation_site) AS total_relocation_sites,

            (SELECT COUNT(*)
             FROM hazard_zone) AS total_hazard_zones,

            (SELECT COUNT(*)
             FROM disaster_event) AS total_disaster_events,

            (SELECT COUNT(*)
             FROM hazard_prediction) AS total_predictions
    """)

    row = db.execute(query).mappings().first()

    return dict(row)