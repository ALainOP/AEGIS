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
### Vulnerability Index

The Vulnerability Index (VI) is calculated using four major factors:

VI = (0.25 × Social Index)
   + (0.20 × Economic Index)
   + (0.25 × Infrastructure Index)
   + (0.30 × Population Index)

Where:

- Social Index = 25%
- Economic Index = 20%
- Infrastructure Index = 25%
- Population Index = 30%

The score ranges from 0 to 100. A higher score indicates greater vulnerability.

Example:

VI = (80 × 0.25) + (70 × 0.20) + (60 × 0.25) + (90 × 0.30)
   = 76

Therefore, the Vulnerability Index is 76/100.
python -m venv .venv
