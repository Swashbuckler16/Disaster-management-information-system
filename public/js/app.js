/**
 * ADREF-DMIS Frontend Application Logic
 * Supports Agile Requirement Evolution for Climate Disaster Management (SDG 13)
 */

let appState = {
  incidents: [],
  evolutions: [],
  jira: { columns: {} },
  metrics: {},
  map: null,
  mapMarkers: []
};

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Mermaid diagrams
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
  }

  // Set up Tabs
  setupTabs();

  // Set up Leaflet Map
  initMap();

  // Load Initial Data from Backend
  await loadData();

  // Setup Event Listeners
  setupEventListeners();

  // Initialize Analytics Charts
  initCharts();
});

// ================= TAB MANAGEMENT =================
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // If switching to map, trigger invalidateSize for smooth tile rendering
      if (targetTabId === 'tab-map' && appState.map) {
        setTimeout(() => appState.map.invalidateSize(), 150);
      }
    });
  });
}

// ================= LEAFLET GIS MAP =================
function initMap() {
  // Default centered around disaster coastal sector
  const defaultCoords = [17.72, 83.26];
  appState.map = L.map('disaster-map').setView(defaultCoords, 12);

  // 1. Tactical Dark Mode Tile Layer (Free OpenStreetMap + CSS Dark Filter - NO API KEY)
  const darkOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    className: 'dark-tiles',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // 2. High-Resolution Satellite Aerial View (ESRI World Imagery - 100% Free, NO API KEY)
  const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
  });

  // 3. Standard Street Map (OpenStreetMap - 100% Free, NO API KEY)
  const standardOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Add default tactical dark mode layer
  darkOSM.addTo(appState.map);

  // Add layer toggle control in top-right corner
  L.control.layers({
    "Tactical Dark Mode": darkOSM,
    "Satellite Aerial View": esriSatellite,
    "Standard Street Map": standardOSM
  }, null, { position: 'topright' }).addTo(appState.map);

  // Add evacuation shelter safe zones (polygon / circles)
  const safeShelter1 = L.circle([17.74, 83.29], {
    color: '#059669',
    fillColor: '#059669',
    fillOpacity: 0.2,
    radius: 900
  }).addTo(appState.map).bindPopup("<b>Evacuation Shelter 1</b><br>Capacity: 5,000 | Power: Generator Active | Medical: Level 2");

  const safeShelter2 = L.circle([17.69, 83.22], {
    color: '#059669',
    fillColor: '#059669',
    fillOpacity: 0.2,
    radius: 800
  }).addTo(appState.map).bindPopup("<b>High Ground Relief Camp 4</b><br>Capacity: 3,500 | Water Supply: Operational");

  // Inundation Danger Zone
  const floodZone = L.polygon([
    [17.68, 83.20],
    [17.67, 83.23],
    [17.70, 83.25],
    [17.71, 83.21]
  ], {
    color: '#ef4444',
    fillColor: '#ef4444',
    fillOpacity: 0.15,
    weight: 1
  }).addTo(appState.map).bindPopup("<b>Coastal Surge Inundation Perimeter</b><br>Predicted Surge: 3.5m - Mandatory Evacuation");

  // Region Selector Listener
  const regionSelect = document.getElementById('map-region-select');
  if (regionSelect) {
    regionSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'coastal') {
        appState.map.setView([17.72, 83.26], 12);
      } else if (val === 'india') {
        appState.map.setView([22.5, 82.5], 5);
      } else if (val === 'global') {
        appState.map.setView([24.0, 20.0], 2);
      }
    });
  }
}

function renderMapMarkers() {
  if (!appState.map) return;

  // Clear existing markers
  appState.mapMarkers.forEach(m => appState.map.removeLayer(m));
  appState.mapMarkers = [];

  appState.incidents.forEach(inc => {
    const isCritical = inc.severity.toLowerCase() === 'critical';
    const markerBg = isCritical ? '#1c1012' : '#14171d';
    const markerBorder = isCritical ? '#ef4444' : '#e5e7eb';
    const markerText = isCritical ? '#fca5a5' : '#ffffff';

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="
        background: ${markerBg};
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid ${markerBorder};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: ${markerText};
        font-weight: 700;
        font-family: monospace;
      ">${isCritical ? '!' : '•'}</div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    const marker = L.marker([inc.lat, inc.lng], { icon: customIcon }).addTo(appState.map);
    
    const popupContent = `
      <div style="font-family: -apple-system, sans-serif; min-width: 190px; color: #090a0d;">
        <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700;">${inc.title}</h4>
        <div style="font-size: 10px; color: #52525b; margin-bottom: 6px; font-family: monospace;">
          TYPE: ${inc.type.toUpperCase()} | SEVERITY: <b style="color: ${isCritical ? '#dc2626' : '#d97706'}">${inc.severity.toUpperCase()}</b>
        </div>
        <div style="font-size: 11px; color: #27272a;">
          Affected: <b>${inc.affected_population.toLocaleString()}</b><br>
          Status: <b>${inc.status}</b><br>
          Unit: <i>${inc.assigned_team}</i>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    appState.mapMarkers.push(marker);
  });
}

// ================= DATA LOADING & SYNC =================
async function loadData() {
  try {
    const res = await fetch('/api/all');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();

    appState.incidents = data.incidents || [];
    appState.evolutions = data.evolution_requests || [];
    appState.jira = data.jira_board || { columns: {} };
    appState.metrics = data.framework_metrics || {};

    renderIncidentsList();
    renderMapMarkers();
    renderEvolutionFeed();
    renderJiraBoard();
    updateBadges();
  } catch (err) {
    console.warn("Backend API not reachable; falling back to local simulation data", err);
    useFallbackData();
  }
}

function useFallbackData() {
  // Pre-loaded realistic fallback in case accessed statically without server
  appState.incidents = [
    {
      id: "INC-201",
      title: "Coastal Embankment Breach at Sector 4A",
      type: "Flood/Surge",
      lat: 17.6868,
      lng: 83.2185,
      severity: "Critical",
      affected_population: 12500,
      status: "In Progress",
      assigned_team: "NDRF Batt 04 & Coast Guard"
    },
    {
      id: "INC-202",
      title: "Hospital Emergency Generator Failure due to Inundation",
      type: "Infrastructure Crisis",
      lat: 17.7231,
      lng: 83.3012,
      severity: "Critical",
      affected_population: 480,
      status: "Under Triage",
      assigned_team: "Rapid Power Unit 2"
    },
    {
      id: "INC-203",
      title: "Primary Highway Route 16 Bridge Structural Scour",
      type: "Logistics Route Disruption",
      lat: 17.7845,
      lng: 83.2450,
      severity: "High",
      affected_population: 35000,
      status: "Route Blocked",
      assigned_team: "Civil Eng Taskforce"
    }
  ];

  appState.evolutions = [
    {
      id: "ECR-301",
      title: "Dynamic Drone Telemetry Layer for Inaccessible Submerged Routes",
      requester: "Field Commander - Coastal Rescue (First Responder)",
      disaster_trigger: "Super Cyclone Embankment Breach (INC-201)",
      sdg_impact: "Accelerates flood zone casualty evacuation (SDG 13.1)",
      urgency: "EMERGENCY_CRITICAL",
      original_requirement: "Static offline route maps updated once daily.",
      evolved_requirement: "Real-time UAV video & infrared stream integrated directly into GIS dispatch map with live passability tagging.",
      status: "APPROVED_SPRINT_INJECTED",
      impact_analysis: { technical_debt_cost: "2 Story Points", system_risk: "Low" }
    }
  ];

  appState.jira = {
    columns: {
      backlog: [{ id: "SEP-105", title: "Automated Satellite InSAR Ingestion", points: 5, priority: "Medium", stage: "backlog" }],
      todo: [{ id: "SEP-101", title: "[EVOLVED] Real-time UAV Drone Video Telemetry Overlay", points: 2, priority: "Critical", stage: "todo", isEvolved: true }],
      in_progress: [{ id: "SEP-102", title: "[EVOLVED] Offline SMS Gateway & Local Sync", points: 3, priority: "High", stage: "in_progress", isEvolved: true }],
      testing: [{ id: "SEP-107", title: "Multi-Agency Handshake Protocol", points: 3, priority: "High", stage: "testing" }],
      done: [{ id: "SEP-098", title: "Pediatric & Geriatric Shelter Allocation", points: 1, priority: "Critical", stage: "done", isEvolved: true }]
    }
  };

  renderIncidentsList();
  renderMapMarkers();
  renderEvolutionFeed();
  renderJiraBoard();
  updateBadges();
}

function updateBadges() {
  const incBadge = document.getElementById('incident-count-badge');
  const ecrBadge = document.getElementById('ecr-count-badge');
  const incLiveTag = document.getElementById('incidents-live-tag');
  const ecrCounter = document.getElementById('ecr-active-counter');

  if (incBadge) incBadge.textContent = appState.incidents.length;
  if (ecrBadge) ecrBadge.textContent = appState.evolutions.length;
  if (incLiveTag) incLiveTag.textContent = `${appState.incidents.length} Active`;
  if (ecrCounter) ecrCounter.textContent = `${appState.evolutions.length} Evolved Stories`;
}

// ================= RENDER INCIDENTS =================
function renderIncidentsList() {
  const container = document.getElementById('incidents-container');
  if (!container) return;
  container.innerHTML = '';

  appState.incidents.forEach(inc => {
    const isCritical = inc.severity.toLowerCase() === 'critical';
    const item = document.createElement('div');
    item.className = `incident-item ${isCritical ? 'critical' : 'high'}`;

    item.innerHTML = `
      <div class="incident-header">
        <span class="incident-title">${inc.title}</span>
        <span class="task-priority ${isCritical ? 'priority-critical' : 'priority-high'}">${inc.severity}</span>
      </div>
      <div class="incident-meta">
        <span>📍 (${inc.lat}, ${inc.lng})</span>
        <span>👥 ${inc.affected_population.toLocaleString()} affected</span>
      </div>
      <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.35rem;">
        Unit: <span style="color: var(--text-main);">${inc.assigned_team}</span> | Status: <b>${inc.status}</b>
      </div>
    `;

    // Click incident to zoom on map
    item.addEventListener('click', () => {
      if (appState.map) {
        appState.map.setView([inc.lat, inc.lng], 14, { animate: true });
        // Find corresponding marker and open popup
        const marker = appState.mapMarkers.find(m => {
          const latLng = m.getLatLng();
          return Math.abs(latLng.lat - inc.lat) < 0.001 && Math.abs(latLng.lng - inc.lng) < 0.001;
        });
        if (marker) marker.openPopup();
      }
    });

    container.appendChild(item);
  });
}

// ================= RENDER AGILE EVOLUTIONS FEED =================
function renderEvolutionFeed() {
  const container = document.getElementById('ecr-feed-container');
  if (!container) return;
  container.innerHTML = '';

  appState.evolutions.forEach(ecr => {
    const card = document.createElement('div');
    card.className = 'evolution-card';

    const isCritical = ecr.urgency.includes('CRITICAL');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
        <span class="ecr-badge">${ecr.id}</span>
        <span class="task-priority ${isCritical ? 'priority-critical' : 'priority-high'}">${ecr.urgency.replace('_', ' ')}</span>
      </div>

      <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.3rem;">
        ${ecr.title}
      </h4>

      <div style="font-size: 0.72rem; color: var(--text-dim); margin-bottom: 0.6rem;">
        Trigger: <span style="color: var(--accent-cyan); font-weight: 500;">${ecr.disaster_trigger}</span> | Requester: <b>${ecr.requester}</b>
      </div>

      <div class="evolution-comparison">
        <div class="orig-box">
          <div style="font-size: 0.68rem; color: var(--text-dim); font-weight: 600; text-transform: uppercase;">Original Static Spec</div>
          <div style="color: var(--text-muted); margin-top: 0.2rem;">${ecr.original_requirement}</div>
        </div>
        <div class="evolved-box">
          <div style="font-size: 0.68rem; color: var(--accent-teal); font-weight: 600; text-transform: uppercase;">Evolved Agile Solution</div>
          <div style="color: #e0f2fe; margin-top: 0.2rem; font-weight: 500;">${ecr.evolved_requirement}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; margin-top: 0.6rem; border-top: 1px solid var(--border-subtle); padding-top: 0.4rem;">
        <span style="color: var(--status-success); font-weight: 500;">Sprint Injected (Effort: ${ecr.impact_analysis ? ecr.impact_analysis.technical_debt_cost : '2 SP'})</span>
        <span class="sdg-badge" style="font-size: 0.65rem;">SDG 13.1</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// ================= RENDER JIRA KANBAN BOARD =================
function renderJiraBoard() {
  const cols = ['backlog', 'todo', 'in_progress', 'testing', 'done'];

  cols.forEach(col => {
    const colElement = document.getElementById(`tasks-${col}`);
    const badgeElement = document.getElementById(`badge-${col}`);
    const tasks = (appState.jira.columns && appState.jira.columns[col]) ? appState.jira.columns[col] : [];

    if (badgeElement) badgeElement.textContent = tasks.length;
    if (!colElement) return;

    colElement.innerHTML = '';

    tasks.forEach(task => {
      const card = document.createElement('div');
      const isEvolved = task.title.includes('[EVOLVED]') || task.ecr_ref || task.isEvolved;
      card.className = `task-card ${isEvolved ? 'evolved' : ''}`;

      const priorityClass = `priority-${(task.priority || 'medium').toLowerCase()}`;

      card.innerHTML = `
        <div class="task-header">
          <span class="task-key">${task.id}</span>
          <span class="task-priority ${priorityClass}">${task.priority}</span>
        </div>
        <div class="task-title">
          ${isEvolved ? '<span class="brand-badge" style="font-size: 0.62rem; padding: 0.05rem 0.35rem; margin-right: 4px;">Evolved</span>' : ''}
          ${task.title.replace('[EVOLVED] ', '')}
        </div>
        <div class="task-footer">
          <div class="task-assignee">
            <span>Assignee: ${task.assignee || 'Dev Team'}</span>
          </div>
          <span class="task-points">${task.points || 2} SP</span>
        </div>

        <div class="task-actions">
          ${col !== 'backlog' ? `<button class="task-btn btn-move-prev" data-id="${task.id}" data-col="${col}">←</button>` : ''}
          ${col !== 'done' ? `<button class="task-btn btn-move-next" data-id="${task.id}" data-col="${col}" style="margin-left: auto;">Advance →</button>` : '<span style="color: var(--status-success); font-size: 0.68rem; margin-left: auto; font-weight: 500;">Deployed</span>'}
        </div>
      `;

      colElement.appendChild(card);
    });
  });

  // Attach column navigation button listeners
  document.querySelectorAll('.btn-move-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-id');
      const currentCol = btn.getAttribute('data-col');
      const colsOrder = ['backlog', 'todo', 'in_progress', 'testing', 'done'];
      const nextIdx = colsOrder.indexOf(currentCol) + 1;
      if (nextIdx < colsOrder.length) {
        moveTask(taskId, currentCol, colsOrder[nextIdx]);
      }
    });
  });

  document.querySelectorAll('.btn-move-prev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-id');
      const currentCol = btn.getAttribute('data-col');
      const colsOrder = ['backlog', 'todo', 'in_progress', 'testing', 'done'];
      const prevIdx = colsOrder.indexOf(currentCol) - 1;
      if (prevIdx >= 0) {
        moveTask(taskId, currentCol, colsOrder[prevIdx]);
      }
    });
  });
}

async function moveTask(taskId, fromCol, toCol) {
  try {
    const res = await fetch('/api/jira/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, from_col: fromCol, to_col: toCol })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Task ${taskId} moved to ${toCol.toUpperCase()}`, 'info');
      await loadData();
    }
  } catch (err) {
    // Local fallback update
    const cols = appState.jira.columns;
    if (cols[fromCol]) {
      const idx = cols[fromCol].findIndex(t => t.id === taskId);
      if (idx !== -1) {
        const item = cols[fromCol].splice(idx, 1)[0];
        item.stage = toCol;
        if (!cols[toCol]) cols[toCol] = [];
        cols[toCol].push(item);
        renderJiraBoard();
        showToast(`Task ${taskId} moved to ${toCol.toUpperCase()}`, 'info');
      }
    }
  }
}

// ================= EVENT LISTENERS & FORM HANDLERS =================
function setupEventListeners() {
  // Modal open / close
  const btnReportInc = document.getElementById('btn-report-incident');
  const modalInc = document.getElementById('modal-incident');
  const modalClose = document.getElementById('modal-incident-close');

  if (btnReportInc && modalInc) {
    btnReportInc.addEventListener('click', () => modalInc.classList.add('active'));
  }
  if (modalClose && modalInc) {
    modalClose.addEventListener('click', () => modalInc.classList.remove('active'));
  }

  // Header quick ECR button - jump to evolution tab and focus title
  const btnOpenECR = document.getElementById('btn-open-ecr');
  if (btnOpenECR) {
    btnOpenECR.addEventListener('click', () => {
      const evolutionTabBtn = document.querySelector('[data-tab="tab-evolution"]');
      if (evolutionTabBtn) evolutionTabBtn.click();
      const titleInput = document.getElementById('ecr-title');
      if (titleInput) titleInput.focus();
    });
  }

  // Recenter Map
  const btnRecenter = document.getElementById('btn-recenter-map');
  if (btnRecenter && appState.map) {
    btnRecenter.addEventListener('click', () => {
      appState.map.setView([17.72, 83.26], 12);
    });
  }

  // Handle ECR Form Submission
  const formECR = document.getElementById('form-ecr');
  if (formECR) {
    formECR.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        title: document.getElementById('ecr-title').value,
        requester: document.getElementById('ecr-requester').value,
        urgency: document.getElementById('ecr-urgency').value,
        disaster_trigger: document.getElementById('ecr-trigger').value,
        original_requirement: document.getElementById('ecr-orig').value || 'Standard static procedure',
        evolved_requirement: document.getElementById('ecr-evolved').value,
        points: 2
      };

      try {
        const res = await fetch('/api/evolutions/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          showToast(`Emergency requirement injected into Sprint: ${result.created.id}`, 'success');
          formECR.reset();
          await loadData();
        }
      } catch (err) {
        // Fallback local insertion
        const newId = `ECR-30${appState.evolutions.length + 1}`;
        const newECR = {
          id: newId,
          ...payload,
          status: 'APPROVED_SPRINT_INJECTED',
          impact_analysis: { technical_debt_cost: "2 Story Points" }
        };
        appState.evolutions.unshift(newECR);

        // Add to Jira
        const newJira = {
          id: `SEP-${110 + appState.evolutions.length}`,
          title: `[EVOLVED] ${payload.title}`,
          points: 2,
          priority: payload.urgency.includes('CRITICAL') ? 'Critical' : 'High',
          stage: 'todo',
          isEvolved: true
        };
        if (!appState.jira.columns.todo) appState.jira.columns.todo = [];
        appState.jira.columns.todo.unshift(newJira);

        renderEvolutionFeed();
        renderJiraBoard();
        updateBadges();
        showToast(`Emergency requirement logged: ${newId}`, 'success');
        formECR.reset();
      }
    });
  }

  // Handle New Incident Form Submission
  const formIncident = document.getElementById('form-new-incident');
  if (formIncident) {
    formIncident.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        title: document.getElementById('inc-title').value,
        type: document.getElementById('inc-type').value,
        severity: document.getElementById('inc-severity').value,
        lat: parseFloat(document.getElementById('inc-lat').value),
        lng: parseFloat(document.getElementById('inc-lng').value),
        affected_population: parseInt(document.getElementById('inc-pop').value)
      };

      try {
        const res = await fetch('/api/incidents/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          showToast(`Incident logged & rescue unit dispatched`, 'info');
          modalInc.classList.remove('active');
          formIncident.reset();
          await loadData();
        }
      } catch (err) {
        const newInc = {
          id: `INC-20${appState.incidents.length + 1}`,
          ...payload,
          status: 'Dispatched',
          assigned_team: 'Rapid Triage Force'
        };
        appState.incidents.unshift(newInc);
        renderIncidentsList();
        renderMapMarkers();
        updateBadges();
        showToast(`Incident logged locally`, 'info');
        modalInc.classList.remove('active');
        formIncident.reset();
      }
    });
  }

  // Export Audit Report
  const btnExport = document.getElementById('btn-export-audit');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      window.print();
    });
  }
}

// ================= ANALYTICS CHARTS (CHART.JS) =================
function initCharts() {
  const ctxTurnaround = document.getElementById('chart-turnaround');
  const ctxRelevance = document.getElementById('chart-relevance');

  if (ctxTurnaround) {
    new Chart(ctxTurnaround, {
      type: 'bar',
      data: {
        labels: ['Waterfall Model', 'Standard 2-Wk Scrum', 'Proposed ADREF Framework'],
        datasets: [{
          label: 'Requirement Change Turnaround Time (Hours)',
          data: [168, 48, 2.4],
          backgroundColor: [
            '#27272a',
            '#52525b',
            '#ffffff'
          ],
          borderColor: [
            '#3f3f46',
            '#71717a',
            '#ffffff'
          ],
          borderWidth: 1,
          borderRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#71717a', font: { family: 'monospace', size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#9ea3ae', font: { size: 11 } }
          }
        }
      }
    });
  }

  if (ctxRelevance) {
    new Chart(ctxRelevance, {
      type: 'radar',
      data: {
        labels: [
          'Field Relevance under Chaos',
          'Adaptation Velocity',
          'Resource Preservation',
          'SDG 13 Compliance',
          'Offline Fault Tolerance'
        ],
        datasets: [
          {
            label: 'Proposed ADREF Framework',
            data: [96.8, 95.0, 91.2, 94.2, 98.0],
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: '#ffffff',
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#07080a',
            borderWidth: 1.5
          },
          {
            label: 'Traditional Waterfall DMIS',
            data: [38.2, 22.0, 45.0, 50.0, 30.0],
            backgroundColor: 'rgba(75, 85, 99, 0.08)',
            borderColor: '#4b5563',
            pointBackgroundColor: '#4b5563',
            pointBorderColor: '#07080a',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#9ea3ae', font: { size: 10, family: 'monospace' } }
          }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.06)' },
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            pointLabels: { color: '#71717a', font: { size: 10 } },
            ticks: { display: false, max: 100, min: 0 }
          }
        }
      }
    });
  }
}

// ================= TOAST NOTIFICATIONS =================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="font-weight: 600; color: ${type === 'success' ? '#34d399' : '#60a5fa'};">[${type === 'success' ? 'SUCCESS' : 'INFO'}]</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
