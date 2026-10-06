# Software Architecture & UML Specifications
## Topic: Agile Requirement Evolution Framework for a Disaster Management Information System (DMIS)
### Enterprise Architecture Specification | Multi-Stakeholder Collaboration Model

---

## 1. System Architecture Diagram (C4 Component Model)
This diagram can be rendered in Draw.io, Lucidchart, or MS Visio:

```mermaid
graph TD
    subgraph Client_Tier["Client Presentation Layer (Web / Mobile PWA)"]
        UI_MAP[GIS Tactical Leaflet Map]
        UI_EVOL[Field Requirement Evolution Portal]
        UI_JIRA[Crisis Sprint Kanban Board]
        UI_ANALYTICS[SDG 13 Impact Dashboard]
    end

    subgraph Service_Tier["Microservice Application Tier (Python REST / AREE)"]
        API_GW[HTTP & JSON REST Dispatcher]
        AREE_ENG[Agile Requirement Evolution Engine]
        IMPACT_ANALYZER[Algorithmic Risk & DUS Calculator]
        INCIDENT_MGR[Spatial Hazard & Resource Dispatcher]
        SYNC_SVC[Offline-First Synchronization Worker]
    end

    subgraph Persistence_Tier["Persistence & Cache Layer"]
        DB_GEO[(Spatial Inundation & Alert Store - GeoJSON)]
        DB_SPRINT[(Agile Sprint Backlog & RTM Store)]
        DB_OFFLINE[(Browser Local IndexedDB Storage)]
    end

    UI_MAP --> API_GW
    UI_EVOL --> API_GW
    UI_JIRA --> API_GW
    UI_ANALYTICS --> API_GW
    UI_MAP -.-> DB_OFFLINE

    API_GW --> AREE_ENG
    API_GW --> INCIDENT_MGR
    API_GW --> SYNC_SVC

    AREE_ENG --> IMPACT_ANALYZER
    AREE_ENG --> DB_SPRINT
    INCIDENT_MGR --> DB_GEO
```

---

## 2. UML Use Case Model
Captures stakeholder interactions across First Responders, Incident Commanders, Agile Scrum Teams, and Climate Analysts:

```mermaid
flowchart LR
    FR((First Responder))
    IC((Incident Commander))
    SM((Agile Scrum Master))
    CA((Climate Analyst))

    subgraph Boundaries["Disaster Management Information System (DMIS)"]
        UC1([UC-1: Submit Field Change Request - FCR])
        UC2([UC-2: Automated Urgency & Risk Scoring])
        UC3([UC-3: Inject Evolved Story to Crisis Sprint])
        UC4([UC-4: Dispatch Relief & Medical Resources])
        UC5([UC-5: View Tactical Inundation GIS Map])
        UC6([UC-6: Reconcile Offline Data Sync])
        UC7([UC-7: Audit SDG 13 Resilience Metrics])
    end

    FR --> UC1
    FR --> UC5
    FR --> UC6

    UC1 --> UC2
    UC2 --> UC3

    IC --> UC3
    IC --> UC4
    IC --> UC5

    SM --> UC3
    CA --> UC5
    CA --> UC7
```

---

## 3. UML Sequence Diagram: Rapid Requirement Evolution Cycle
Demonstrates the sub-3-minute workflow from hazard detection to sprint card creation:

```mermaid
sequenceDiagram
    autonumber
    actor Field as First Responder (Field)
    participant UI as DMIS Web Client
    participant Engine as Agile Evolution Engine (AREE)
    participant Jira as Jira Sprint Backlog
    participant Dev as Rapid Dev Swarm
    participant Responders as Field Tactical Units

    Field->>UI: Submits FCR: "Route 16 Bridge Scoured, Deploy UAV Telemetry"
    UI->>Engine: POST /api/evolutions/submit
    activate Engine
    Engine->>Engine: Evaluate Urgency: Safety Impact (9.4), Risk (Low)
    Engine->>Engine: Compute Story Points: 2 SP
    Engine->>Jira: Append Task [SEP-110] into 'todo' Column
    Engine-->>UI: 200 OK: ECR Approved & Sprint Injected
    deactivate Engine

    Jira-->>Dev: Rapid Dev Alert: Critical Task Injected
    Dev->>Jira: Advance to 'In Progress'
    Dev->>Jira: Advance to 'Testing'
    Dev->>UI: Hot-Deploy Drone Telemetry Layer
    UI->>Responders: Live Stream Displayed on Tactical Map
```

---

## 4. UML Class Diagram
Object-oriented class structures enforcing modularity and requirement traceability:

```mermaid
classDiagram
    class Incident {
        +String incidentId
        +String title
        +String type
        +Float lat
        +Float lng
        +String severity
        +Int affectedPopulation
        +String status
        +String assignedTeam
        +updateStatus()
        +getGeoJsonPoint()
    }

    class EvolutionChangeRequest {
        +String ecrId
        +String title
        +String requester
        +String disasterTrigger
        +String urgency
        +String originalRequirement
        +String evolvedRequirement
        +Float urgencyScore
        +String status
        +performImpactAnalysis()
        +generateSprintTask()
    }

    class JiraTask {
        +String taskId
        +String title
        +String priority
        +Int storyPoints
        +String assignee
        +String stage
        +String ecrReference
        +advanceStage()
    }

    class ImpactAnalysis {
        +String systemRisk
        +String databaseImpact
        +String userSafetyGain
        +String technicalDebtCost
        +calculateDUS()
    }

    class SDGMetricTracker {
        +String sdgTarget
        +Float turnaroundTimeHours
        +Float deliveryAccuracy
        +Float failureRate
        +generateAuditReport()
    }

    Incident "1" --> "0..*" EvolutionChangeRequest : triggers
    EvolutionChangeRequest "1" *-- "1" ImpactAnalysis : evaluates
    EvolutionChangeRequest "1" --> "1" JiraTask : injects
    JiraTask "0..*" --> "1" SDGMetricTracker : updates
```

---

## 5. Agile Activity Diagram (Workflow Logic)
Visualizes decision gates for emergency requirement acceptance vs. deferred backlog:

```mermaid
flowchart TD
    Start([Disaster Operational Shift Detected]) --> Submit[Field Responder Submits FCR]
    Submit --> Parse[AREE Parses Operational Parameters]
    Parse --> ComputeDUS{Calculate Disaster Urgency Score DUS}
    ComputeDUS -->|DUS >= 3.0: Critical Threat| EmergencyInject[Inject directly into active Crisis Sprint To-Do]
    ComputeDUS -->|DUS < 3.0: Non-Critical| DeferBacklog[Queue in Product Backlog for next Sprint Planning]
    EmergencyInject --> DevSwarm[Assign to Rapid Dev Swarm 2-Hour Spike]
    DevSwarm --> AutoTest[Run Automated Regression & Safety Smoke Test]
    AutoTest -->|Pass| Deploy[Hot-Deploy Update to Field Clients OTA]
    AutoTest -->|Fail| QuickFix[Refactor & Re-test]
    QuickFix --> AutoTest
    Deploy --> Feedback[Monitor Field Rescue Efficacy]
    Feedback --> End([Continuous Adaptation Maintained])
```
