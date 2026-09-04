from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine
from app.routers import (
    state_router,
    district_router,
    habitation_router,
    hazard_router
)
from app.routers import recommendation_router
from app.routers import vulnerability_router
from app.routers import relocation_priority_router
from app.routers import relocation_site_router
from app.routers import relocation_plan_router
from app.routers import disaster_router
from app.routers import prediction_router
from app.routers import gis_router
from app.routers import dashboard_router
app = FastAPI(
    title="Disaster Relocation Decision Support API",
    description="Backend API for disaster risk assessment and relocation planning",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Disaster Relocation API is running"
    }


@app.get("/health")
def health():

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:

        return {
            "status": "unhealthy",
            "database": "connection failed",
            "error": str(e)
        }


app.include_router(state_router.router)
app.include_router(district_router.router)
app.include_router(habitation_router.router)
app.include_router(hazard_router.router)
app.include_router(vulnerability_router.router)
app.include_router(relocation_priority_router.router)
app.include_router(relocation_site_router.router)
app.include_router(relocation_plan_router.router)
app.include_router(disaster_router.router)
app.include_router(prediction_router.router)
app.include_router(gis_router.router)
app.include_router(dashboard_router.router)
app.include_router(recommendation_router.router)