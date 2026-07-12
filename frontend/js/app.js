// ------------------ token check + load user profile (keep your existing code) ------------------
const token = localStorage.getItem('token');
// if you want to keep requiring login on index page, leave as-is. Otherwise comment out for demo.
// if (!token) { window.location.href = 'login.html'; }

// loadUserProfile(); // keep your existing function call if present

// ------------------ DYNAMIC PLACES (fetched from backend) ------------------
let places = [];

async function loadPlaces() {
  try {
    const res = await fetch('https://crowd-guardian-zsn3.onrender.com/api/places');
    const result = await res.json();
    places = result.data || result || [];
  } catch (err) {
    console.error('Failed to load places:', err);
  }
}

// ------------------ MAP (Leaflet) with color-coded markers ------------------
let markers = {};
let myMap = null;

function markerColorFor(percent) {
  if (percent >= 70) return 'red';
  if (percent >= 40) return 'orange';
  return 'green';
}

// small helper to create colored circle markers using Leaflet divIcon for clarity
function createColoredMarker(lat, lng, color) {
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 24 24">
    <path fill="${color}" d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5" fill="#fff"/>
  </svg>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [28,36],
    iconAnchor: [14,36],
    popupAnchor: [0, -36]
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize map (Hyderabad center)
  myMap = L.map('map').setView([17.3850, 78.4867], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(myMap);

  // Load places from backend BEFORE using them
  await loadPlaces();

  // Render markers from places
  markers = {};
  places.forEach(p => {
    const color = markerColorFor(p.crowdPercent);
    const marker = L.marker([p.lat, p.lng], { icon: createColoredMarker(p.lat, p.lng, color) })
      .addTo(myMap)
      .bindPopup(`<strong>${p.name}</strong><br>${p.description}<br><small>Crowd: ${p.crowdPercent}%</small>`);

    marker.on('click', () => showDetails(p.name));
    markers[p.id] = marker;
  });

  // initial render of cards
  renderPlaces();

  // animate any progress bars we already rendered
  animateAllProgress();

  // Chart init (preserve red line look)
  initChart();

  // Wire dark mode toggle
  const darkBtn = document.getElementById('darkModeToggle');
  darkBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkBtn.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  });
});

// ------------------ RENDER PLACES (update to use place-card class) ------------------
function renderPlaces(filterText = "") {
  const container = document.getElementById('placesContainer');
  container.innerHTML = '';

  const filtered = places.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));
  filtered.forEach(p => {
    const div = document.createElement('div');
    div.className = 'place-card';
    div.innerHTML = `
      <div>
        <h5>${p.name}</h5>
        <div class="meta">${p.category} • ${p.description}</div>
      </div>
      <div>
        <div class="d-flex align-items-center justify-content-between">
          <div style="width:70%;">
            <div class="progress mt-2">
              <div class="progress-bar" role="progressbar" style="width:0%" aria-valuenow="${p.crowdPercent}" aria-valuemin="0" aria-valuemax="100">${p.crowdPercent}%</div>
            </div>
          </div>
          <div style="width:25%; text-align:right;">
            ${crowdLevelBadge(p.crowdPercent)}
          </div>
        </div>
        <div class="actions mt-2">
          <button class="btn btn-sm btn-outline-primary me-2" onclick="showDetails('${p.name}')">Details</button>
          <button class="btn btn-sm btn-success" onclick="reportCrowd(${p.id})">Report</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  // after DOM update animate progress fills
  animateAllProgress();
}

// animate progress bars from 0 to target
function animateAllProgress() {
  document.querySelectorAll('.progress-bar').forEach(pb => {
    const target = Number(pb.getAttribute('aria-valuenow')) || 0;
    pb.style.width = '0%';
    pb.innerText = '0%';
    let curr = 0;
    const step = Math.max(1, Math.round(target / 20));
    const id = setInterval(() => {
      curr += step;
      if (curr >= target) {
        curr = target;
        clearInterval(id);
      }
      pb.style.width = curr + '%';
      pb.innerText = curr + '%';
    }, 12);
  });
}

// keep your existing crowdLevelBadge function (or copy it if absent)
function crowdLevelBadge(percent) {
  if (percent >= 70) return `<span class="badge bg-danger">High</span>`;
  if (percent >= 40) return `<span class="badge bg-warning text-dark">Medium</span>`;
  return `<span class="badge bg-success">Low</span>`;
}

// ------------------ showDetails/reportCrowd (keep your previous implementations) ------------------
// If you already have showDetails and reportCrowd, leave them unchanged.
// I include simple versions if needed:

function showDetails(locationName) {
  const place = places.find(p => p.name === locationName);
  if (!place) return;
  if (markers[place.id]) markers[place.id].openPopup();

  document.getElementById('modalBody').innerHTML = `
    <strong>${place.name}</strong><br>
    Category: ${place.category}<br>
    Crowd: ${place.crowdPercent}%<br>
    Description: ${place.description}
  `;
  const myModal = new bootstrap.Modal(document.getElementById('crowdModal'));
  myModal.show();
}

function reportCrowd(id) {
  const level = prompt('Report crowd % (example: 70 for 70%)');
  if (!level) return;
  // local demo: update places array and UI
  const idx = places.findIndex(p => p.id === id);
  if (idx !== -1) {
    places[idx].crowdPercent = Number(level);
    // update marker color
    const color = markerColorFor(places[idx].crowdPercent);
    const newIcon = createColoredMarker(places[idx].lat, places[idx].lng, color);
    markers[id].setIcon(newIcon);
    renderPlaces();
    alert('Thanks — reported ' + level + '%. (Local demo)');
  }
}

// ------------------ Chart (preserve red chart) ------------------
let chartInstance = null;
function initChart() {
  const ctx = document.getElementById('crowdChart').getContext('2d');
  const data = {
    labels: ['8 AM','10 AM','12 PM','2 PM','4 PM','6 PM'],
    datasets: [{
      label: 'Temple A',
      data: [10, 20, 40, 60, 80, 75],
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220,53,69,0.15)',
      fill: true,
      tension: 0.3
    }]
  };

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'line',
    data,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: false }
      },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ------------------ SEARCH wiring ------------------
document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('searchInput').value.trim();
  renderPlaces(q);
});
document.getElementById('searchInput').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') document.getElementById('searchBtn').click();
});





