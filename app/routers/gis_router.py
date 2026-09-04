from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db

router = APIRouter(
    prefix="/gis",
    tags=["GIS"]
)


# 1. Find habitations located inside hazard/red zones
@router.get("/habitations-in-red-zones")
def get_habitations_in_red_zones(
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            h.habitation_id,
            h.name AS habitation,
            hz.zone_id,
            hz.zone_name AS hazard_zone,
            ht.name AS hazard_type,
            hz.risk_score,
            hh.exposure_level,
            hh.exposure_score
        FROM habitation h
        JOIN hazard_zone hz
            ON ST_Within(
                h.location::geometry,
                hz.boundary
            )
        JOIN hazard_type ht
            ON hz.hazard_type_id = ht.hazard_type_id
        LEFT JOIN habitation_hazard hh
            ON hh.habitation_id = h.habitation_id
            AND hh.zone_id = hz.zone_id
        ORDER BY hz.risk_score DESC;
    """)

    rows = db.execute(query).mappings().all()

    return [dict(row) for row in rows]


# 2. Find nearest relocation site for a habitation
@router.get("/nearest-site/{habitation_id}")
def get_nearest_site(
    habitation_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            h.habitation_id,
            h.name AS habitation,
            rs.site_id,
            rs.name AS relocation_site,
            rs.suitability_score,
            ROUND(
                (ST_Distance(h.location, rs.location) / 1000)::numeric,
                2
            ) AS distance_km
        FROM habitation h
        CROSS JOIN relocation_site rs
        WHERE h.habitation_id = :habitation_id
        ORDER BY ST_Distance(h.location, rs.location)
        LIMIT 1;
    """)

    row = db.execute(
        query,
        {"habitation_id": habitation_id}
    ).mappings().first()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Habitation or relocation site not found"
        )

    return dict(row)


# 3. Find suitable relocation sites
@router.get("/suitable-sites/{habitation_id}")
def get_suitable_sites(
    habitation_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            h.name AS habitation,
            rs.site_id,
            rs.name AS relocation_site,
            rs.suitability_score,
            ROUND(
                (ST_Distance(h.location, rs.location) / 1000)::numeric,
                2
            ) AS distance_km
        FROM habitation h
        CROSS JOIN relocation_site rs
        WHERE h.habitation_id = :habitation_id
          AND rs.suitability_score >= 85
        ORDER BY
            rs.suitability_score DESC,
            ST_Distance(h.location, rs.location);
    """)

    rows = db.execute(
        query,
        {"habitation_id": habitation_id}
    ).mappings().all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="No suitable relocation sites found"
        )

    return [dict(row) for row in rows]


# 4. Calculate distance between habitation and relocation site
@router.get("/distance/{habitation_id}/{site_id}")
def calculate_distance(
    habitation_id: int,
    site_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            h.name AS habitation,
            rs.name AS relocation_site,
            ROUND(
                (ST_Distance(h.location, rs.location) / 1000)::numeric,
                2
            ) AS distance_km
        FROM habitation h
        CROSS JOIN relocation_site rs
        WHERE h.habitation_id = :habitation_id
          AND rs.site_id = :site_id;
    """)

    row = db.execute(
        query,
        {
            "habitation_id": habitation_id,
            "site_id": site_id
        }
    ).mappings().first()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Habitation or relocation site not found"
        )

    return dict(row)