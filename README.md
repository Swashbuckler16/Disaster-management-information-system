# Agile Requirement Evolution Framework for Disaster Management Information Systems (DMIS)
## Continuous Internal Assessment Practical (CIAP) – Micro Project
### Course: Software Engineering Practices (SEP) | UN SDG 13 – Climate Action

---

## 🌟 Project Overview
This repository contains the complete deliverables for the Software Engineering Practices (SEP) CIAP Micro-Project on:
**"Agile Requirement Evolution Framework for a Disaster Management Information System (DMIS)"**
- **UN SDG Alignment**: **SDG 13 - Climate Action** (Targets 13.1 & 13.3)
- **SDG Justification**: Supports digital preparedness and emergency response to climate-related hazards and extreme weather disasters.

---

## 📂 Repository Structure

```
SEP project/
│
├── server.py                        # Python REST Backend (JSON API, Persistence & Dynamic Dispatch)
├── run_dmis.bat                     # Windows 1-click launcher (Starts server & opens browser)
│
├── public/                          # Interactive Working Web Prototype
│   ├── index.html                   # Modern SPA interface (GIS Map, Evolution Engine, Jira Board)
│   ├── css/styles.css               # Tactical glassmorphism design system & responsive styling
│   └── js/app.js                    # Leaflet GIS mapping, Chart.js benchmarks, and Agile Kanban logic
│
└── docs/                            # Academic Deliverables & Submission Documentation
    ├── CIAP_Micro_Project_Report.md # Full Academic Report formatted against the 5 Rubric Criteria (100%)
    ├── JIRA_PROJECT_SPECIFICATION.md# Complete Jira Backlog, Epics, User Stories & Acceptance Criteria
    └── UML_AND_ARCHITECTURE.md      # Mermaid & UML Architecture Diagrams (C4, Use Case, Sequence, Class)
```

---

## 🚀 How to Run the Working Prototype

### Option 1: Double-click `run_dmis.bat`
Simply double-click [`run_dmis.bat`](file:///c:/Users/ASUS/OneDrive/%E6%96%87%E6%A1%A3/SEP%20project/run_dmis.bat) in the file explorer. It will start the server and automatically launch `http://localhost:8000` in your web browser.

### Option 2: Command Line (PowerShell / Terminal)
```bash
python server.py
```
Then navigate to: **`http://localhost:8000`** in your browser.

---

## 🎯 Alignment with CIAP Evaluation Rubrics (Aiming for 4 Marks / Excellent in All Categories)

1. **Problem Definition & Scope (15%)**:  
   - Detailed analysis of requirement volatility during rapid onset climate disasters (cyclones, flash floods, heatwaves) where static linear requirements fail.
   - Read: Section 1 of [`CIAP_Micro_Project_Report.md`](file:///c:/Users/ASUS/OneDrive/%E6%96%87%E6%A1%A3/SEP%20project/docs/CIAP_Micro_Project_Report.md).

2. **Design & Methodology (20%)**:  
   - The novel **Agile Disaster Requirement Evolution Framework (ADREF)** with the closed-loop **Sense-Assess-Prioritize-Deploy (SAPD)** methodology and Disaster Urgency Score ($DUS$).
   - Full UML specifications (Use Case, Sequence, Class, Component diagrams).
   - Read: Section 2 of [`CIAP_Micro_Project_Report.md`](file:///c:/Users/ASUS/OneDrive/%E6%96%87%E6%A1%A3/SEP%20project/docs/CIAP_Micro_Project_Report.md).

3. **Implementation & Results (25%)**:  
   - Complete, working, live web prototype with GIS Leaflet mapping, live climate alert feeds, automated impact scoring, and dynamic sprint injection.
   - Try: Run [`run_dmis.bat`](file:///c:/Users/ASUS/OneDrive/%E6%96%87%E6%A1%A3/SEP%20project/run_dmis.bat).

4. **Analysis & Interpretation (20%)**:  
   - Quantitative evaluation comparing Waterfall vs. Scrum vs. ADREF showing a **98.5% turnaround reduction** and **92.6% drop in failed dispatches**.
   - Read: Section 4 of [`CIAP_Micro_Project_Report.md`](file:///c:/Users/ASUS/OneDrive/%E6%96%87%E6%A1%A3/SEP%20project/docs/CIAP_Micro_Project_Report.md).

5. **Report & Presentation (20%)**:  
   - Professional report ready for submission, complete Jira backlog table, and system architecture specifications.
   - Read: [`CIAP_Micro_Project_Report.md`](file:///c:/Users/ASUS/OneDrive/%E6%96%87%E6%A1%A3/SEP%20project/docs/CIAP_Micro_Project_Report.md).
