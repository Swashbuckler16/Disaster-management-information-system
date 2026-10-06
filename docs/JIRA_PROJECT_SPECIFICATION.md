# JIRA Project Specification & Sprint Backlog
## Project Key: `SEP-DMIS`
## Project Name: Disaster Management Information System (ADREF)
## Agile Methodology: Crisis-Response Scrum & Kanban Hybrid (4-Hour Rapid Adaptation Sprints)

---

## 1. Epics Overview

| Epic Key | Epic Summary | Associated SDG Target | Total Story Points | Status |
| :--- | :--- | :--- | :--- | :--- |
| **EPIC-1** | Early Warning & GIS Spatial Disaster Intelligence | SDG 13.1 (Resilience & Early Warning) | 18 SP | IN PROGRESS |
| **EPIC-2** | Agile Requirement Evolution Engine (AREE) | SDG 13.3 (Collaborative Capacity) | 22 SP | ACTIVE SPRINT |
| **EPIC-3** | Offline Fault-Tolerance & Field Responders Triage | SDG 13.1 (Infrastructure Resilience) | 16 SP | IN PROGRESS |
| **EPIC-4** | Multi-Agency Interoperability & Audit Analytics | SDG 13.1 & 13.3 | 12 SP | PLANNED |

---

## 2. Sprint Specification: `SPRINT-CRISIS-04`

- **Sprint Goal**: Adapt software workflows to mitigate coastal cyclone surge inundation and communications blackout within a 4-hour agile adaptation cycle.
- **Sprint Duration**: 4 Hours (Emergency Rapid Cycle)
- **Target Velocity**: 34 Story Points
- **Scrum Master**: Agile Response Lead
- **Product Owner**: Emergency Operations Incident Commander

---

## 3. User Stories with Acceptance Criteria (Gherkin Format)

### Story 1: `SEP-101`
- **Summary**: Real-Time UAV Drone Video Telemetry Overlay on Leaflet GIS Map
- **Issue Type**: Evolved Emergency Story (Origin: `ECR-301`)
- **Epic**: EPIC-1
- **Priority**: Critical / Highest (Urgency Score: 4.85)
- **Story Points**: 2 SP
- **Assignee**: DevOps & Frontend Swarm
- **Status**: Sprint Ready (`todo`)
- **User Story**:
  > *As a* Field Rescue Commander navigating flood inundations,  
  > *I want* real-time drone telemetry and video overlays directly on my GIS tactical map,  
  > *So that* I can steer evacuation boats around submerged powerlines and scoured bridges.
- **Acceptance Criteria**:
  - `Given` a field UAV is airborne over flooded Sector 4,
  - `When` the video stream emits WebRTC/RTSP frames,
  - `Then` the DMIS Leaflet map renders the live video tile with latency under 500ms.
  - `And` impassable routes are dynamically marked with red hazard polygons.

---

### Story 2: `SEP-102`
- **Summary**: Offline-First SMS Token Handshake & IndexedDB Reconciliation
- **Issue Type**: Evolved Emergency Story (Origin: `ECR-302`)
- **Epic**: EPIC-3
- **Priority**: Critical
- **Story Points**: 3 SP
- **Assignee**: Backend Lead
- **Status**: In Rapid Dev (`in_progress`)
- **User Story**:
  > *As a* Relief NGO Logistics Officer operating during a cellular network collapse,  
  > *I want* the DMIS app to cache supply verifications in IndexedDB and fallback to compressed 140-character SMS tokens,  
  > *So that* aid delivery tracking continues uninterrupted without broadband internet.
- **Acceptance Criteria**:
  - `Given` network connectivity drops below ping threshold (packet loss > 90%),
  - `When` a supply package is delivered at Camp 7,
  - `Then` the transaction is written to browser IndexedDB storage,
  - `And` a compressed base64 SMS token is dispatched to the emergency gateway (`+1-800-DMIS-SYNC`),
  - `And` local and server databases reconcile with zero data loss once 4G/LTE is restored.

---

### Story 3: `SEP-098`
- **Summary**: Pediatric & Geriatric Vulnerability Weighted Shelter Allocation Algorithm
- **Issue Type**: Evolved Emergency Story (Origin: `ECR-303`)
- **Epic**: EPIC-2
- **Priority**: Critical
- **Story Points**: 1 SP
- **Assignee**: Algorithm Lead
- **Status**: Field Deployed (`done`)
- **User Story**:
  > *As an* Incident Health Officer triaging overcrowded relief shelters,  
  > *I want* shelter bed allocation algorithms to prioritize infants, elderly, and oxygen-dependent patients over first-come-first-served,  
  > *So that* preventable casualties in storm shelters are minimized.
- **Acceptance Criteria**:
  - `Given` a relief shelter has limited bed capacity (< 100 beds remaining),
  - `When` new families arrive for triage,
  - `Then` priority sorting assigns weight $W = (Age_{<5} \times 2.5) + (Age_{>65} \times 2.0) + (O_2\text{ Needs} \times 4.0)$,
  - `And` high-risk individuals are allocated to generator-equipped medical bays.

---

### Story 4: `SEP-105`
- **Summary**: Automated Satellite InSAR Flood Extent Polygon Ingestion
- **Issue Type**: Standard Story
- **Epic**: EPIC-1
- **Priority**: Medium
- **Story Points**: 5 SP
- **Assignee**: GIS Data Specialist
- **Status**: Backlog (`backlog`)
- **User Story**:
  > *As a* Climate Disaster Forecaster,  
  > *I want* automated ingestion of Sentinel-1 InSAR satellite imagery,  
  > *So that* predictive flood polygons are generated 6 hours before river overflow occurs.

---

## 4. Agile Ceremonies & Cadence during Disaster Operations

1. **Continuous Backlog Grooming (Sense Phase)**:
   - Responders submit Field Change Requests (FCRs) on-the-fly.
   - The Automated Impact Analyzer ranks stories by Disaster Urgency Score ($DUS$).
2. **Crisis Standup (10 Minutes Every 2 Hours)**:
   - Questions addressed: What critical blockage was resolved? What road/communication failure occurred? What hotfix is deploying next?
3. **Hot-Deploy Retrospective**:
   - Post-landfall review measuring Requirement Volatility Index (RVI) and Mean Time to Adapt (MTTA).
