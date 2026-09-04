# Disaster Relocation Decision Support Backend

Backend API for an intelligent GIS-enabled disaster relocation decision support platform.

## Project Objective

The system helps disaster management authorities:

- Identify high-risk habitations
- Detect habitations inside disaster Red Zones
- Assess population vulnerability
- Calculate relocation priority
- Find suitable relocation sites
- Check carrying capacity
- Calculate distance between habitations and relocation sites
- Recommend the best relocation site
- Store disaster history and hazard predictions
- Provide dashboard statistics

## Technology Stack

- Python
- FastAPI
- PostgreSQL
- PostGIS
- SQLAlchemy
- GeoAlchemy2
- Pydantic
- Uvicorn

## Database

Database:

`disaster_relocation_db`

PostgreSQL is used for relational data and PostGIS is used for geographical operations.

## Run the Backend

Create and activate virtual environment:

```bash
python -m venv .venv