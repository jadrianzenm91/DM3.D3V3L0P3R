// Usamos ruta relativa para que funcione tanto local como en producción (Render)
const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    document.getElementById('current-date').textContent = new Date().toLocaleDateString();
    await loadCatalogos();
    await loadDashboardData();

    document.getElementById('daily-form').addEventListener('submit', handleFormSubmit);
}

function showSection(sectionId) {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('report').classList.add('hidden');

    document.getElementById(sectionId).classList.remove('hidden');
}

async function loadCatalogos() {
    try {
        const response = await fetch(`${API_BASE_URL}/catalogos`);
        const { condiciones, ubigeo } = await response.json();

        const condSelect = document.getElementById('condicion');
        condSelect.innerHTML = condiciones.map(c => `<option value="${c.IDCONDICION}">${c.NOMBRE}</option>`).join('');

        const ubiSelect = document.getElementById('ubigeo-id');
        ubiSelect.innerHTML = '<option value="">Seleccione Ubicación</option>' +
            ubigeo.map(u => `<option value="${u.IDUBICACION}">${u.LUGAR} - ${u.UBIGEO}</option>`).join('');
    } catch (error) {
        console.error('Error cargando catálogos:', error);
    }
}

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/resumen-diario`);
        const data = await response.json();

        const tableBody = document.getElementById('summary-table-body');
        let totals = { efectivo: 0, operativos: 0, inoperativos: 0, disponibles: 0 };

        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay reportes para hoy</td></tr>';
        }

        data.forEach(item => {
            totals.efectivo += item.EFECTIVO || 0;
            totals.operativos += item.OPERATIVOS || 0;
            totals.inoperativos += item.INOPERATIVOS || 0;
            totals.disponibles += item.DISPONIBLES || 0;

            const row = `
                <tr class="hover:bg-slate-800 transition">
                    <td class="p-4 font-semibold">${item.TIPOAERONAVE}</td>
                    <td class="p-4">${item.EFECTIVO}</td>
                    <td class="p-4 text-success">${item.OPERATIVOS}</td>
                    <td class="p-4 text-danger">${item.INOPERATIVOS}</td>
                    <td class="p-4 text-accent">${item.DISPONIBLES}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        document.getElementById('total-efectivos').textContent = totals.efectivo;
        document.getElementById('total-operativos').textContent = totals.operativos;
        document.getElementById('total-inoperativos').textContent = totals.inoperativos;
        document.getElementById('total-disponibles').textContent = totals.disponibles;
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

async function generarParteDiario() {
    try {
        const response = await fetch(`${API_BASE_URL}/generar-parte-diario`, {
            method: 'POST'
        });
        const result = await response.json();

        if (result.status === 'success') {
            alert('¡Parte Diario generado correctamente!');
            await loadDashboardData();
        } else {
            alert('Atención: ' + result.message);
        }
    } catch (error) {
        alert('Error al generar parte diario: ' + error.message);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = {
        tipo_aeronave: document.getElementById('tipo-aeronave').value,
        matricula: document.getElementById('matricula').value,
        id_condicion: document.getElementById('condicion').value,
        id_ubicacion: document.getElementById('ubigeo-id').value,
        total_horas: document.getElementById('total-horas').value,
        cod_unidad: document.getElementById('cod-unidad').value,
        sigla: document.getElementById('sigla').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/registrar-situacion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Situación registrada. No olvide "Generar Parte Hoy" para actualizar el resumen.');
            e.target.reset();
            showSection('dashboard');
            await loadDashboardData();
        }
    } catch (error) {
        alert('Error al guardar el reporte: ' + error.message);
    }
}
