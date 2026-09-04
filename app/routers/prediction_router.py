from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.hazard_prediction import HazardPrediction
from app.schemas.prediction import HazardPredictionResponse


router = APIRouter(
    prefix="/predictions",
    tags=["AI Predictions"]
)


@router.get(
    "/",
    response_model=list[HazardPredictionResponse]
)
def get_predictions(
    db: Session = Depends(get_db)
):
    return (
        db.query(HazardPrediction)
        .order_by(HazardPrediction.predicted_risk.desc())
        .all()
    )


@router.get(
    "/habitation/{habitation_id}",
    response_model=list[HazardPredictionResponse]
)
def get_habitation_predictions(
    habitation_id: int,
    db: Session = Depends(get_db)
):

    results = (
        db.query(HazardPrediction)
        .filter(
            HazardPrediction.habitation_id == habitation_id
        )
        .order_by(HazardPrediction.predicted_risk.desc())
        .all()
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No predictions found for this habitation"
        )

    return results
@router.get(
    "/habitation/{habitation_id}/details"
)
def get_prediction_details(
    habitation_id: int,
    db: Session = Depends(get_db)
):

    from app.models.habitation import Habitation
    from app.models.hazard_type import HazardType

    results = (
        db.query(
            Habitation.name.label("habitation"),
            HazardType.name.label("hazard"),
            HazardPrediction.prediction_date,
            HazardPrediction.predicted_risk,
            HazardPrediction.confidence_score,
            HazardPrediction.model_version
        )
        .join(
            HazardPrediction,
            Habitation.habitation_id ==
            HazardPrediction.habitation_id
        )
        .join(
            HazardType,
            HazardPrediction.hazard_type_id ==
            HazardType.hazard_type_id
        )
        .filter(
            Habitation.habitation_id == habitation_id
        )
        .order_by(
            HazardPrediction.predicted_risk.desc()
        )
        .all()
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No prediction details found"
        )

    return [
        {
            "habitation": row.habitation,
            "hazard": row.hazard,
            "prediction_date": row.prediction_date,
            "predicted_risk": (
                float(row.predicted_risk)
                if row.predicted_risk is not None
                else None
            ),
            "confidence_score": (
                float(row.confidence_score)
                if row.confidence_score is not None
                else None
            ),
            "model_version": row.model_version
        }
        for row in results
    ]