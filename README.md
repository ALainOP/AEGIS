# 🛡️ RakshaSetu DSS (रक्षारक्षा सेतु)
### Multi-Hazard Disaster Relocation Decision Support System

[![React](https://img.shields.io/badge/React-18-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900.svg?style=flat-square&logo=leaflet)](https://leafletjs.com/)

**RakshaSetu DSS** is an operational Decision Support System engineered for National Disaster Response Force (NDRF), State Disaster Management Authorities (SDMA), and District Emergency Operations Centres (DEOC). It provides real-time telemetry, red zone geospatial risk analysis, capacity balancing across safe shelters, algorithmic relocation dispatch, and emergency response management.

---

## 🌟 Key Features

- **🌐 Public Portal & Landing Page**: Official civic interface with NDRF guidelines, active advisories, emergency helplines, e-Shradhanjali tribute portal, and training modules.
- **🚨 Live Telemetry & Marquee Alerts**: Real-time sensor feeds (water level, seismic activity, rain gauges, wind velocity) with dynamic alert severity scoring.
- **🗺️ Red Zone Geospatial Command**: Interactive GIS mapping powered by Leaflet visualizing flood plains, landslide vulnerability zones, active relief camps, and stranded populations.
- **⚖️ Shelter Capacity Balancer**: Dynamic camp occupancy tracking, relief supplies allocation (food, medical, water, sanitation), and spillover prevention.
- **📋 Relocation Dispatch Queue**: Algorithmic prioritization of habitations by vulnerability index, enabling single-click coordinated evacuations.
- **📊 Incident Reports & Analytics**: Situation reports, casualty mitigation forecasts, and post-event analytics powered by Recharts.
- **🔐 Multi-Tier Role Access**: Specialized interfaces for Central NDRF HQ, SDMA Controllers, DEOC Officers, and Field Dispatchers.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS with military/civic design tokens
- **GIS / Mapping**: Leaflet & React-Leaflet
- **Data Visualization**: Recharts
- **Animations**: Framer Motion & CSS keyframes
- **Icons**: Lucide React
- **Build Tool**: Vite

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shield-007/rakshasetu-dss.git
   cd rakshasetu-dss
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## 📁 Directory Structure

```
├── public/                 # Static assets and sample imagery
├── src/
│   ├── assets/             # Brand logos and vector assets
│   ├── components/         # Reusable UI widgets, layout & modal dialogs
│   │   ├── layout/         # TopBar, Sidebar, Navigation
│   │   └── modals/         # Relocation dispatch assistant dialogs
│   ├── context/            # DisasterContext & state management
│   ├── data/               # Mock telemetry, habitations & relief shelters
│   ├── pages/              # Overview, Map, Capacity, Queue, Reports, Settings
│   ├── types/              # TypeScript definitions
│   ├── App.tsx             # Root application router and view controller
│   └── main.tsx            # React application entry point
├── package.json
└── vite.config.ts
```

---

## 📜 License

This project is developed for the Smart India Hackathon (SIH).
All rights reserved.

# AEGIS
SIH 2026

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
