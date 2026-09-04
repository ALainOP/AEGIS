from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db

from app.services.relocation_recommendation_service import (
    calculate_recommendation_score,
    get_recommendation_level
)


router = APIRouter(
    prefix="/recommendations",
    tags=["Relocation Recommendations"]
)


@router.get("/{habitation_id}")
def get_relocation_recommendations(
    habitation_id: int,
    db: Session = Depends(get_db)
):

    query = text("""
        SELECT
            h.habitation_id,
            h.name AS habitation,
            h.households,

            rs.site_id,
            rs.name AS relocation_site,
            rs.suitability_score,

            cc.max_households,
            cc.water_availability,
            cc.environmental_clearance_status,

            ROUND(
                (ST_Distance(h.location, rs.location) / 1000)::numeric,
                2
            ) AS distance_km

        FROM habitation h

        CROSS JOIN relocation_site rs

        LEFT JOIN carrying_capacity cc
            ON rs.site_id = cc.site_id

        WHERE h.habitation_id = :habitation_id

        ORDER BY rs.suitability_score DESC
    """)

    rows = db.execute(
        query,
        {"habitation_id": habitation_id}
    ).mappings().all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="Habitation not found"
        )

    recommendations = []

    for row in rows:

        suitability = float(
            row["suitability_score"] or 0
        )

        households = row["households"] or 0

        max_households = row["max_households"] or 0

        distance = float(
            row["distance_km"] or 0
        )

        # ----------------------------------
        # Capacity score
        # ----------------------------------

        if (
        max_households > 0
        and households <= max_households
        and row["environmental_clearance_status"] == "Approved"):
            
            capacity_score = 100
        else:
            capacity_score = 0


        # ----------------------------------
        # Distance score
        # ----------------------------------

        if distance <= 10:

            distance_score = 100

        elif distance <= 25:

            distance_score = 80

        elif distance <= 50:

            distance_score = 60

        elif distance <= 100:

            distance_score = 40

        else:

            distance_score = 20


        # ----------------------------------
        # Final recommendation score
        # ----------------------------------

        recommendation_score = calculate_recommendation_score(
            suitability,
            capacity_score,
            distance_score
        )

        recommendation_level = get_recommendation_level(
            recommendation_score
        )


        recommendations.append({

            "habitation_id": row["habitation_id"],

            "habitation": row["habitation"],

            "households": households,

            "site_id": row["site_id"],

            "relocation_site": row["relocation_site"],

            "suitability_score": suitability,

            "max_households": max_households,

            "distance_km": distance,

            "water_availability": (
                float(row["water_availability"])
                if row["water_availability"] is not None
                else None
            ),

            "environmental_clearance_status":
                row["environmental_clearance_status"],

            "capacity_available":
                households <= max_households
                if max_households > 0
                else False,

            "recommendation_score":
                recommendation_score,

            "recommendation_level":
                recommendation_level
        })


    # Sort best recommendation first

    recommendations.sort(
        key=lambda x: x["recommendation_score"],
        reverse=True
    )


    return recommendations
@router.get("/{habitation_id}/best")
def get_best_relocation_site(
    habitation_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            h.name AS habitation,
            h.households,

            rs.site_id,
            rs.name AS relocation_site,
            rs.suitability_score,

            cc.max_households,
            cc.water_availability,
            cc.environmental_clearance_status,

            ROUND(
                (ST_Distance(h.location, rs.location) / 1000)::numeric,
                2
            ) AS distance_km

        FROM habitation h

        CROSS JOIN relocation_site rs

        LEFT JOIN carrying_capacity cc
            ON rs.site_id = cc.site_id

        WHERE h.habitation_id = :habitation_id
          AND rs.suitability_score >= 85
          AND cc.max_households >= h.households
          AND cc.environmental_clearance_status = 'Approved'

        ORDER BY
            rs.suitability_score DESC,
            ST_Distance(h.location, rs.location)

        LIMIT 1;
    """)

    row = db.execute(
        query,
        {"habitation_id": habitation_id}
    ).mappings().first()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="No suitable relocation site found"
        )

    return {
        "habitation": row["habitation"],
        "households": row["households"],
        "recommended_site": row["relocation_site"],
        "site_id": row["site_id"],
        "suitability_score": float(
            row["suitability_score"]
        ),
        "max_households": row["max_households"],
        "distance_km": float(
            row["distance_km"]
        ),
        "water_availability": float(
            row["water_availability"]
        ) if row["water_availability"] is not None else None,
        "environmental_clearance_status":
            row["environmental_clearance_status"]
    }