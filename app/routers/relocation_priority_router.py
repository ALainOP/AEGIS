from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.relocation_priority import RelocationPriority
from app.models.habitation import Habitation
from app.models.vulnerability_assessment import VulnerabilityAssessment
from app.models.hazard_zone import HazardZone
from app.models.habitation_hazard import HabitationHazard
from app.models.disaster_event import DisasterEvent
from app.models.habitation_disaster import HabitationDisaster

from app.schemas.relocation_priority import RelocationPriorityResponse

from app.services.relocation_priority_service import calculate_priority_score


router = APIRouter(
    prefix="/relocation-priority",
    tags=["Relocation Priority"]
)


# ------------------------------------------------
# GET ALL PRIORITIES
# ------------------------------------------------

@router.get(
    "/",
    response_model=list[RelocationPriorityResponse]
)
def get_all_priorities(
    db: Session = Depends(get_db)
):

    return db.query(RelocationPriority).order_by(
        RelocationPriority.priority_score.desc()
    ).all()


# ------------------------------------------------
# GET HIGH-RISK HABITATIONS
# ------------------------------------------------

@router.get(
    "/high-risk",
    response_model=list[RelocationPriorityResponse]
)
def get_high_risk_habitations(
    db: Session = Depends(get_db)
):

    return db.query(RelocationPriority).filter(
        RelocationPriority.priority_score >= 80
    ).order_by(
        RelocationPriority.priority_score.desc()
    ).all()


# ------------------------------------------------
# GET PRIORITY FOR ONE HABITATION
# ------------------------------------------------

@router.get(
    "/habitation/{habitation_id}",
    response_model=RelocationPriorityResponse
)
def get_habitation_priority(
    habitation_id: int,
    db: Session = Depends(get_db)
):

    priority = db.query(RelocationPriority).filter(
        RelocationPriority.habitation_id == habitation_id
    ).order_by(
        RelocationPriority.priority_score.desc()
    ).first()

    if priority is None:
        raise HTTPException(
            status_code=404,
            detail="Relocation priority not found"
        )

    return priority


# ------------------------------------------------
# CALCULATE AND SAVE PRIORITY
# ------------------------------------------------

@router.post(
    "/calculate/{habitation_id}",
    response_model=RelocationPriorityResponse
)
def calculate_habitation_priority(
    habitation_id: int,
    db: Session = Depends(get_db)
):

    # ---------------------------------------------
    # 1. Find habitation
    # ---------------------------------------------

    habitation = db.query(Habitation).filter(
        Habitation.habitation_id == habitation_id
    ).first()

    if habitation is None:
        raise HTTPException(
            status_code=404,
            detail="Habitation not found"
        )


    # ---------------------------------------------
    # 2. Get latest vulnerability assessment
    # ---------------------------------------------

    vulnerability = (
        db.query(VulnerabilityAssessment)
        .filter(
            VulnerabilityAssessment.habitation_id == habitation_id
        )
        .order_by(
            VulnerabilityAssessment.assessment_date.desc()
        )
        .first()
    )

    if vulnerability is None:
        raise HTTPException(
            status_code=404,
            detail="Vulnerability assessment not found"
        )

    vulnerability_score = float(
        vulnerability.overall_score or 0
    )


    # ---------------------------------------------
    # 3. Get highest hazard risk
    # ---------------------------------------------

    hazard_result = (
        db.query(HazardZone.risk_score)
        .join(
            HabitationHazard,
            HazardZone.zone_id == HabitationHazard.zone_id
        )
        .filter(
            HabitationHazard.habitation_id == habitation_id
        )
        .order_by(
            HazardZone.risk_score.desc()
        )
        .first()
    )

    if hazard_result:

        hazard_risk = float(
            hazard_result[0] or 0
        )

    else:

        hazard_risk = 0


    # ---------------------------------------------
    # 4. Get latest disaster history
    # ---------------------------------------------

    disaster_result = (
        db.query(
            DisasterEvent.severity,
            HabitationDisaster.casualties,
            HabitationDisaster.property_loss
        )
        .join(
            HabitationDisaster,
            DisasterEvent.event_id ==
            HabitationDisaster.event_id
        )
        .filter(
            HabitationDisaster.habitation_id ==
            habitation_id
        )
        .order_by(
            DisasterEvent.event_date.desc()
        )
        .first()
    )


    # ---------------------------------------------
    # 5. Calculate disaster history score
    # ---------------------------------------------

    if disaster_result:

        severity = float(
            disaster_result.severity or 0
        )

        casualties = (
            disaster_result.casualties or 0
        )

        property_loss = float(
            disaster_result.property_loss or 0
        )

        casualty_score = min(
            casualties * 2,
            100
        )

        loss_score = min(
            property_loss / 1_000_000,
            100
        )

        disaster_history_score = (
            severity * 0.60
            + casualty_score * 0.20
            + loss_score * 0.20
        )

        disaster_history_score = round(
            min(disaster_history_score, 100),
            2
        )

    else:

        disaster_history_score = 0


    # ---------------------------------------------
    # 6. Use Priority Service
    # ---------------------------------------------

    result = calculate_priority_score(
        hazard_risk,
        vulnerability_score,
        disaster_history_score
    )


    # ---------------------------------------------
    # 7. Check existing priority record
    # ---------------------------------------------

    priority = db.query(RelocationPriority).filter(
        RelocationPriority.habitation_id ==
        habitation_id
    ).first()


    # ---------------------------------------------
    # 8. Update existing record
    # ---------------------------------------------

    if priority:

        priority.priority_score = result["priority_score"]

        priority.priority_level = result["priority_level"]

        priority.relocation_phase = result["relocation_phase"]

        priority.reason = (
            f"Hazard risk: {hazard_risk}, "
            f"Vulnerability: {vulnerability_score}, "
            f"Disaster history: {disaster_history_score}"
        )


    # ---------------------------------------------
    # 9. Create new record
    # ---------------------------------------------

    else:

        priority = RelocationPriority(

            habitation_id=habitation_id,

            priority_score=result["priority_score"],

            priority_level=result["priority_level"],

            relocation_phase=result["relocation_phase"],

            reason=(
                f"Hazard risk: {hazard_risk}, "
                f"Vulnerability: {vulnerability_score}, "
                f"Disaster history: {disaster_history_score}"
            )
        )

        db.add(priority)


    # ---------------------------------------------
    # 10. Save to PostgreSQL
    # ---------------------------------------------

    db.commit()

    db.refresh(priority)


    return priority