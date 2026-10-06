"""
Disaster Management Information System (DMIS) - Agile Requirement Evolution Backend
Supports SDG 13 (Climate Action) Digital Preparedness & Response
Custom Lightweight REST Server in Python (Standard Library)
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import mimetypes
from datetime import datetime

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')

# In-memory database with persistent defaults
DATA = {
    "system_info": {
        "title": "ADREF-DMIS: Agile Disaster Requirement Evolution Framework",
        "sdg_target": "SDG 13 - Climate Action (Target 13.1 & 13.3)",
        "version": "1.0.0-PROTOTYPE",
        "status": "OPERATIONAL_EMERGENCY_READY"
    },
    "alerts": [
        {
            "id": "ALT-101",
            "type": "Cyclone Warning",
            "title": "Super Cyclone Vayu Approaching Eastern Coast",
            "severity": "CRITICAL",
            "location": "Bay of Bengal / Sector 4 Coastal Zone",
            "timestamp": "2026-10-06 02:30 UTC",
            "parameters": {"wind_speed": "185 km/h", "rainfall": "320 mm", "surge": "4.2 m"},
            "status": "Active Warning"
        },
        {
            "id": "ALT-102",
            "type": "Flash Flood Alert",
            "title": "River Basin Overflow Threatening Urban Basements",
            "severity": "HIGH",
            "location": "River Valley - District 3",
            "timestamp": "2026-10-06 03:15 UTC",
            "parameters": {"water_level": "+2.8m above danger", "discharge": "45,000 cusecs"},
            "status": "Evacuation Initiated"
        },
        {
            "id": "ALT-103",
            "type": "Extreme Heatwave",
            "title": "Severe Heat Index Reaching 47.5°C in Inland Plains",
            "severity": "MODERATE",
            "location": "Zone 2 Industrial & Urban Core",
            "timestamp": "2026-10-06 01:00 UTC",
            "parameters": {"temp": "47.5°C", "humidity": "68%", "uv_index": "11+"},
            "status": "Advisory Active"
        }
    ],
    "incidents": [
        {
            "id": "INC-201",
            "title": "Coastal Embankment Breach at Sector 4A",
            "type": "Flood/Surge",
            "lat": 17.6868,
            "lng": 83.2185,
            "severity": "Critical",
            "affected_population": 12500,
            "status": "In Progress",
            "assigned_team": "NDRF Batt 04 & Coast Guard",
            "reported_at": "2026-10-06 02:45 UTC",
            "updated_at": "2026-10-06 03:40 UTC"
        },
        {
            "id": "INC-202",
            "title": "Hospital Emergency Generator Failure due to Inundation",
            "type": "Infrastructure Crisis",
            "lat": 17.7231,
            "lng": 83.3012,
            "severity": "Critical",
            "affected_population": 480,
            "status": "Under Triage",
            "assigned_team": "Rapid Power Unit 2",
            "reported_at": "2026-10-06 03:00 UTC",
            "updated_at": "2026-10-06 03:30 UTC"
        },
        {
            "id": "INC-203",
            "title": "Primary Highway Route 16 Bridge Structural Scour",
            "type": "Logistics Route Disruption",
            "lat": 17.7845,
            "lng": 83.2450,
            "severity": "High",
            "affected_population": 35000,
            "status": "Route Blocked",
            "assigned_team": "Civil Eng Taskforce",
            "reported_at": "2026-10-06 03:10 UTC",
            "updated_at": "2026-10-06 03:25 UTC"
        },
        {
            "id": "INC-204",
            "title": "Relief Camp 7 Clean Water Shortage & Contamination Risk",
            "type": "Water & Sanitation",
            "lat": 17.7100,
            "lng": 83.2000,
            "severity": "High",
            "affected_population": 3200,
            "status": "Dispatched",
            "assigned_team": "Red Cross WASH Unit",
            "reported_at": "2026-10-06 03:20 UTC",
            "updated_at": "2026-10-06 03:45 UTC"
        },
        {
            "id": "INC-205",
            "title": "Brahmaputra Basin Flood & Riverbank Erosion",
            "type": "Severe Inundation",
            "lat": 26.1850,
            "lng": 91.7500,
            "severity": "Critical",
            "affected_population": 84000,
            "status": "In Progress",
            "assigned_team": "SDRF Assam Force 02",
            "reported_at": "2026-10-06 01:10 UTC",
            "updated_at": "2026-10-06 03:00 UTC"
        },
        {
            "id": "INC-206",
            "title": "Himalayan Cloudburst & Glacial Outburst Alert",
            "type": "Flash Flood & Landslide",
            "lat": 30.3165,
            "lng": 78.0322,
            "severity": "High",
            "affected_population": 18500,
            "status": "Under Triage",
            "assigned_team": "ITBP Mountain Rescue",
            "reported_at": "2026-10-06 02:00 UTC",
            "updated_at": "2026-10-06 03:15 UTC"
        },
        {
            "id": "INC-207",
            "title": "Gulf Coastal Storm Surge & Microgrid Blackout",
            "type": "Tropical Hurricane Impact",
            "lat": 28.5383,
            "lng": -81.3792,
            "severity": "Critical",
            "affected_population": 120000,
            "status": "Active Rescue",
            "assigned_team": "FEMA Region IV & Taskforce 1",
            "reported_at": "2026-10-06 00:30 UTC",
            "updated_at": "2026-10-06 02:45 UTC"
        },
        {
            "id": "INC-208",
            "title": "Mediterranean Thermal Anomaly & Forest Wildfire",
            "type": "Extreme Wildfire Front",
            "lat": 38.2466,
            "lng": 21.7346,
            "severity": "High",
            "affected_population": 42000,
            "status": "Aerial Water-Drop Active",
            "assigned_team": "EU Civil Protection Pool",
            "reported_at": "2026-10-06 01:45 UTC",
            "updated_at": "2026-10-06 03:20 UTC"
        }
    ],
    "evolution_requests": [
        {
            "id": "ECR-301",
            "title": "Dynamic Drone Telemetry Layer for Inaccessible Submerged Routes",
            "requester": "Field Commander - Coastal Rescue (First Responder)",
            "disaster_trigger": "Super Cyclone Embankment Breach (INC-201)",
            "sdg_impact": "Accelerates flood zone casualty evacuation (SDG 13.1)",
            "urgency": "EMERGENCY_CRITICAL",
            "change_type": "New Feature (Dynamic Sensor Stream)",
            "original_requirement": "Static offline route maps updated once daily.",
            "evolved_requirement": "Real-time UAV video & infrared stream integrated directly into GIS dispatch map with live passability tagging.",
            "impact_analysis": {
                "system_risk": "Low (Microservice modular feed)",
                "database_impact": "Moderate (High ingestion rate)",
                "user_safety_gain": "Extremely High (Saves ~45 mins per evacuation)",
                "technical_debt_cost": "2 Story Points"
            },
            "status": "APPROVED_SPRINT_INJECTED",
            "sprint_id": "SPRINT-CRISIS-04",
            "votes": 18,
            "submitted_at": "2026-10-06 03:15 UTC"
        },
        {
            "id": "ECR-302",
            "title": "Offline-First SMS/USSD Fallback for Field Supply Verification",
            "requester": "NGO Relief Logistics Lead (Red Cross)",
            "disaster_trigger": "Cellular Tower Micro-Grid Outage in Sector 4",
            "sdg_impact": "Resilient infrastructure under extreme weather (SDG 13.1)",
            "urgency": "HIGH",
            "change_type": "Protocol Adaptation (Network Degradation)",
            "original_requirement": "Online REST JSON API requires 4G/LTE mobile connection.",
            "evolved_requirement": "Automatic fallback to compressed 140-char two-way SMS tokens and local PWA IndexedDB cache when ping fails > 30s.",
            "impact_analysis": {
                "system_risk": "Medium (Requires SMS Gateway webhook)",
                "database_impact": "Low (Optimized sync reconciliation)",
                "user_safety_gain": "High (Enables 100% supply verification continuity)",
                "technical_debt_cost": "3 Story Points"
            },
            "status": "IN_DEVELOPMENT",
            "sprint_id": "SPRINT-CRISIS-04",
            "votes": 14,
            "submitted_at": "2026-10-06 03:22 UTC"
        },
        {
            "id": "ECR-303",
            "title": "Pediatric & Geriatric Vulnerability Metric in Shelter Triage",
            "requester": "District Health Officer (Incident Command)",
            "disaster_trigger": "Overcrowding in Evacuation Center 2 & 7",
            "sdg_impact": "Inclusive climate disaster adaptation (SDG 13.3)",
            "urgency": "HIGH",
            "change_type": "Algorithm Modification (Triage Scoring)",
            "original_requirement": "First-Come First-Served shelter bed assignment.",
            "evolved_requirement": "Dynamic algorithmic triage weighted by age (<5, >65), chronic medical dependency, and oxygen needs.",
            "impact_analysis": {
                "system_risk": "Low (Algorithmic rule update in dispatch engine)",
                "database_impact": "Low (Schema field added)",
                "user_safety_gain": "Critical (Reduces preventable shelter fatalities)",
                "technical_debt_cost": "1 Story Point"
            },
            "status": "DEPLOYED_IN_FIELD",
            "sprint_id": "SPRINT-CRISIS-03",
            "votes": 25,
            "submitted_at": "2026-10-06 02:40 UTC"
        }
    ],
    "jira_board": {
        "current_sprint": "SPRINT-CRISIS-04 (Climate Emergency Rapid Cycle)",
        "sprint_goal": "Adapt to coastal cyclone breach & communications degradation within 4-hour agile loop",
        "velocity": 34,
        "columns": {
            "backlog": [
                {
                    "id": "SEP-105",
                    "title": "Automated Satellite InSAR Flood Extent Polygon Ingestion",
                    "type": "User Story",
                    "priority": "Medium",
                    "points": 5,
                    "assignee": "GIS Team",
                    "sdg": "13.1",
                    "stage": "backlog"
                },
                {
                    "id": "SEP-108",
                    "title": "Volunteer Skill Crowdsourcing & Multilingual Audio Broadcast",
                    "type": "User Story",
                    "priority": "Low",
                    "points": 3,
                    "assignee": "Community Lead",
                    "sdg": "13.3",
                    "stage": "backlog"
                }
            ],
            "todo": [
                {
                    "id": "SEP-101",
                    "title": "Real-time UAV Drone Video Telemetry Overlay on Leaflet Map",
                    "type": "Evolved Emergency Story",
                    "priority": "Highest",
                    "points": 2,
                    "assignee": "DevOps / Frontend",
                    "ecr_ref": "ECR-301",
                    "sdg": "13.1",
                    "stage": "todo"
                },
                {
                    "id": "SEP-104",
                    "title": "Automated Battery Conserve UI Mode for Field First Responders",
                    "type": "Improvement",
                    "priority": "High",
                    "points": 2,
                    "assignee": "UI/UX Lead",
                    "sdg": "13.1",
                    "stage": "todo"
                }
            ],
            "in_progress": [
                {
                    "id": "SEP-102",
                    "title": "Offline-First SMS Gateway & IndexedDB Sync Reconciliation",
                    "type": "Evolved Emergency Story",
                    "priority": "Critical",
                    "points": 3,
                    "assignee": "Backend Lead",
                    "ecr_ref": "ECR-302",
                    "sdg": "13.1",
                    "stage": "in_progress"
                },
                {
                    "id": "SEP-106",
                    "title": "Dynamic Water Disinfection Tablet Logistics Calculation",
                    "type": "Task",
                    "priority": "High",
                    "points": 2,
                    "assignee": "Data Analyst",
                    "sdg": "13.3",
                    "stage": "in_progress"
                }
            ],
            "testing": [
                {
                    "id": "SEP-107",
                    "title": "Multi-Agency Incident Handshake Verification Protocol",
                    "type": "QA / Compliance",
                    "priority": "High",
                    "points": 3,
                    "assignee": "QA Engineer",
                    "sdg": "13.1",
                    "stage": "testing"
                }
            ],
            "done": [
                {
                    "id": "SEP-098",
                    "title": "Pediatric & Geriatric Vulnerability Weighted Shelter Allocation",
                    "type": "Evolved Emergency Story",
                    "priority": "Critical",
                    "points": 1,
                    "assignee": "Algorithm Team",
                    "ecr_ref": "ECR-303",
                    "sdg": "13.3",
                    "stage": "done"
                },
                {
                    "id": "SEP-099",
                    "title": "Climate Alert Ingestion Pipeline (IMD & ECMWF API Connector)",
                    "type": "Feature",
                    "priority": "High",
                    "points": 5,
                    "assignee": "Data Engineer",
                    "sdg": "13.1",
                    "stage": "done"
                }
            ]
        }
    },
    "framework_metrics": {
        "traditional_waterfall": {
            "req_change_turnaround_hours": 168.0,
            "crisis_adaptation_cost": "Very High",
            "field_relevance_score": 38.2,
            "failed_dispatches_pct": 28.5
        },
        "standard_scrum": {
            "req_change_turnaround_hours": 48.0,
            "crisis_adaptation_cost": "Moderate",
            "field_relevance_score": 67.5,
            "failed_dispatches_pct": 14.2
        },
        "adref_agile_framework": {
            "req_change_turnaround_hours": 2.4,
            "crisis_adaptation_cost": "Minimal",
            "field_relevance_score": 96.8,
            "failed_dispatches_pct": 2.1
        },
        "kpis": {
            "total_evolutions_logged": 14,
            "average_triage_time_min": 8.5,
            "sprint_injection_success_rate": 98.4,
            "sdg13_preparedness_index": 94.2
        }
    }
}

class DMISRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path.startswith('/api/'):
            self.handle_api_get(path, urllib.parse.parse_qs(parsed_url.query))
        else:
            super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        content_length = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_body.decode('utf-8')) if post_body else {}
        except Exception:
            payload = {}

        if path.startswith('/api/'):
            self.handle_api_post(path, payload)
        else:
            self.send_error(404, "Not Found")

    def handle_api_get(self, path, query_params):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if path == '/api/all':
            self.wfile.write(json.dumps(DATA).encode('utf-8'))
        elif path == '/api/incidents':
            self.wfile.write(json.dumps(DATA['incidents']).encode('utf-8'))
        elif path == '/api/alerts':
            self.wfile.write(json.dumps(DATA['alerts']).encode('utf-8'))
        elif path == '/api/evolutions':
            self.wfile.write(json.dumps(DATA['evolution_requests']).encode('utf-8'))
        elif path == '/api/jira':
            self.wfile.write(json.dumps(DATA['jira_board']).encode('utf-8'))
        elif path == '/api/metrics':
            self.wfile.write(json.dumps(DATA['framework_metrics']).encode('utf-8'))
        else:
            self.wfile.write(json.dumps({"status": "ok", "message": "API Active"}).encode('utf-8'))

    def handle_api_post(self, path, payload):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if path == '/api/evolutions/submit':
            # Create new evolution request
            new_id = f"ECR-{300 + len(DATA['evolution_requests']) + 1}"
            now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
            
            ecr = {
                "id": new_id,
                "title": payload.get("title", "Untitled Emergency Requirement"),
                "requester": payload.get("requester", "First Responder"),
                "disaster_trigger": payload.get("disaster_trigger", "Field Dynamics"),
                "sdg_impact": payload.get("sdg_impact", "SDG 13.1 Climate Preparedness"),
                "urgency": payload.get("urgency", "HIGH"),
                "change_type": payload.get("change_type", "Operational Adaptation"),
                "original_requirement": payload.get("original_requirement", "Standard protocol"),
                "evolved_requirement": payload.get("evolved_requirement", "Evolved dynamic action"),
                "impact_analysis": {
                    "system_risk": payload.get("system_risk", "Low (Isolated component)"),
                    "database_impact": payload.get("database_impact", "Minimal"),
                    "user_safety_gain": payload.get("user_safety_gain", "Immediate high priority rescue impact"),
                    "technical_debt_cost": f"{payload.get('points', 2)} Story Points"
                },
                "status": "APPROVED_SPRINT_INJECTED",
                "sprint_id": DATA["jira_board"]["current_sprint"].split(" ")[0],
                "votes": 1,
                "submitted_at": now_str
            }
            DATA["evolution_requests"].insert(0, ecr)

            # Automatically inject into Jira Board "todo" column for dynamic adaptation
            jira_item = {
                "id": f"SEP-{110 + len(DATA['evolution_requests'])}",
                "title": f"[EVOLVED] {ecr['title']}",
                "type": "Evolved Emergency Story",
                "priority": "Critical" if ecr['urgency'] == 'EMERGENCY_CRITICAL' else "High",
                "points": int(payload.get('points', 2)),
                "assignee": "Crisis Rapid Dev Swarm",
                "ecr_ref": new_id,
                "sdg": "13.1",
                "stage": "todo"
            }
            DATA["jira_board"]["columns"]["todo"].insert(0, jira_item)
            DATA["framework_metrics"]["kpis"]["total_evolutions_logged"] += 1

            self.wfile.write(json.dumps({"success": True, "created": ecr, "injected_task": jira_item}).encode('utf-8'))

        elif path == '/api/incidents/create':
            new_inc_id = f"INC-{200 + len(DATA['incidents']) + 1}"
            now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
            inc = {
                "id": new_inc_id,
                "title": payload.get("title", "New Climate Incident"),
                "type": payload.get("type", "Severe Weather Impact"),
                "lat": float(payload.get("lat", 17.7000)),
                "lng": float(payload.get("lng", 83.2500)),
                "severity": payload.get("severity", "High"),
                "affected_population": int(payload.get("affected_population", 1000)),
                "status": "Dispatched",
                "assigned_team": payload.get("assigned_team", "Rapid Triage Force"),
                "reported_at": now_str,
                "updated_at": now_str
            }
            DATA["incidents"].insert(0, inc)
            self.wfile.write(json.dumps({"success": True, "created": inc}).encode('utf-8'))

        elif path == '/api/jira/move':
            task_id = payload.get("task_id")
            from_col = payload.get("from_col")
            to_col = payload.get("to_col")
            cols = DATA["jira_board"]["columns"]

            found_item = None
            if from_col in cols:
                for i, item in enumerate(cols[from_col]):
                    if item["id"] == task_id:
                        found_item = cols[from_col].pop(i)
                        break

            if found_item and to_col in cols:
                found_item["stage"] = to_col
                cols[to_col].append(found_item)
                self.wfile.write(json.dumps({"success": True, "task": found_item}).encode('utf-8'))
            else:
                self.wfile.write(json.dumps({"success": False, "message": "Task or column not found"}).encode('utf-8'))
        else:
            self.wfile.write(json.dumps({"status": "unknown_endpoint"}).encode('utf-8'))

def run_server():
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), DMISRequestHandler) as httpd:
        print(f"===========================================================")
        print(f"  ADREF-DMIS Server Running at http://localhost:{PORT}")
        print(f"  Supporting SDG 13 (Climate Action) Digital Preparedness")
        print(f"  Agile Requirement Evolution Framework Prototype")
        print(f"===========================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == '__main__':
    run_server()
