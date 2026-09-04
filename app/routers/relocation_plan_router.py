from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.relocation_plan import RelocationPlan
from app.schemas.relocation_plan import RelocationPlanResponse


router = APIRouter(
    prefix="/relocation-plans",
    tags=["Relocation Plans"]
)


@router.get(
    "/",
    response_model=list[RelocationPlanResponse]
)
def get_all_plans(
    db: Session = Depends(get_db)
):
    return (
        db.query(RelocationPlan)
        .order_by(RelocationPlan.plan_id)
        .all()
    )


@router.get(
    "/active",
    response_model=list[RelocationPlanResponse]
)
def get_active_plans(
    db: Session = Depends(get_db)
):
    return (
        db.query(RelocationPlan)
        .filter(RelocationPlan.status != "Completed")
        .all()
    )


@router.get(
    "/habitation/{habitation_id}",
    response_model=RelocationPlanResponse
)
def get_habitation_plan(
    habitation_id: int,
    db: Session = Depends(get_db)
):

    plan = (
        db.query(RelocationPlan)
        .filter(
            RelocationPlan.habitation_id == habitation_id
        )
        .first()
    )

    if plan is None:
        raise HTTPException(
            status_code=404,
            detail="Relocation plan not found"
        )

    return plan


@router.get(
    "/site/{site_id}",
    response_model=list[RelocationPlanResponse]
)
def get_site_plans(
    site_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(RelocationPlan)
        .filter(RelocationPlan.site_id == site_id)
        .all()
    )