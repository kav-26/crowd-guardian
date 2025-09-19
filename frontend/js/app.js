// sample data
const places = [
  { id: 1, name: "Tirupati Temple", category: "Temple", crowdPercent: 85, description: "Peak in evenings." },
  { id: 2, name: "Central Station", category: "Station", crowdPercent: 45, description: "Moderate." },
  { id: 3, name: "City Park", category: "Park", crowdPercent: 15, description: "Low - good to visit." }
];

function crowdLevelBadge(percent) {
  if (percent >= 70) return `<span class="badge badge-high">High</span>`;
  if (percent >= 40) return `<span class="badge badge-medium">Medium</span>`;
  return `<span class="badge badge-low">Low</span>`;
}

function renderPlaces(filterText = "") {
  const container = document.getElementById('placesContainer');
  container.innerHTML = '';
  const filtered = places.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card mb-3 p-3';
    card.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>
          <h5>${p.name}</h5>
          <small>${p.category}</small>
        </div>
        <div>
          ${crowdLevelBadge(p.crowdPercent)}
          <div class="small text-muted">${p.crowdPercent}% full</div>
        </div>
      </div>
      <p class="mt-2">${p.description}</p>
      <div>
        <button class="btn btn-sm btn-outline-primary" onclick="showDetails(${p.id})">Details</button>
        <button class="btn btn-sm btn-outline-success" onclick="reportCrowd(${p.id})">Report</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function showDetails(id){
  alert('Details for place id: '+id); // later replace with modal
}

function reportCrowd(id){
  const level = prompt('Report crowd % (example: 70 for 70%)');
  if(!level) return;
  alert('Thanks — reported ' + level + '% for place '+id +'. (This is local demo.)');
  // For local MVP you could store report in localStorage
}

// search
document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('searchInput').value;
  renderPlaces(q);
});

// initial render
renderPlaces();

// Chart.js example
const ctx = document.getElementById('crowdChart');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['8 AM','10 AM','12 PM','2 PM','4 PM','6 PM'],
    datasets: [{
      label: 'Temple A',
      data: [10, 20, 40, 60, 80, 75],
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220,53,69,0.2)',
      fill: true
    }]
  }
});

// Modal trigger example
function showDetails(locationName) {
  document.getElementById('modalBody').innerText =
    `Crowd details for ${locationName}`;
  const myModal = new bootstrap.Modal(document.getElementById('crowdModal'));
  myModal.show();
}

//search bar
document.getElementById('searchBar').addEventListener('keyup', function() {
  const value = this.value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(value) ? '' : 'none';
  });
});
