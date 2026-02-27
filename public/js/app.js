// API Interaction
const API_BASE = '/api';

async function fetchData(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error('Error al obtener datos');
    return response.json();
}

async function postData(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al enviar datos');
    return response.json();
}

// Initialization and Data Loading
async function init() {
    try {
        // Load Conditions
        const condiciones = await fetchData('/condiciones');
        const condSelect = document.getElementById('select-condicion');
        condiciones.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.IDCONDICION;
            opt.textContent = c.NOMBRE;
            condSelect.appendChild(opt);
        });

        // Load Locations
        const ubicaciones = await fetchData('/ubicaciones');
        const ubiSelect = document.getElementById('select-ubicacion');
        ubicaciones.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.IDUBICACION;
            opt.textContent = u.LUGAR;
            ubiSelect.appendChild(opt);
        });

        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dash-date').value = today;
        document.getElementById('parte-date').value = today;
        document.querySelector('input[name="FECHA"]').value = today;

        await refreshDashboard();
    } catch (err) {
        console.error(err);
        showToast('Error de conexión con el servidor', 'error');
    }
}

async function refreshDashboard() {
    try {
        const situations = await fetchData('/situacion');
        renderStats(situations);
        renderSituationsTable(situations);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// Event Listeners
document.getElementById('situation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        await postData('/situacion', data);
        showToast('Situación registrada correctamente');
        e.target.reset();
        await refreshDashboard();
        showSection('dashboard');
    } catch (err) {
        showToast(err.message, 'error');
    }
});

async function generarParteDiario() {
    const fecha = document.getElementById('parte-date').value;
    try {
        const res = await postData('/generar-parte-diario', { fecha });
        showToast(res.message);
        await verParteDiario();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function verParteDiario() {
    const fecha = document.getElementById('parte-date').value;
    try {
        const records = await fetchData(`/parte-diario?fecha=${fecha}`);
        renderParteTable(records);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', init);
