// DOM Elements
const sections = ['dashboard', 'reporte-manual', 'parte-diario'];

function showSection(sectionId) {
    sections.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.textContent.toLowerCase().includes(sectionId.split('-')[0])) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function renderStats(situations) {
    const statsGrid = document.getElementById('stats-grid');
    const total = situations.length;
    const ops = situations.filter(s => s.IDCONDICION === 1).length;
    const inops = situations.filter(s => s.IDCONDICION === 2).length;
    const disp = situations.filter(s => s.IDCONDICION === 3).length;

    statsGrid.innerHTML = `
        <div class="glass-card p-6 border-l-4 border-blue-500">
            <p class="text-sm text-gray-400 font-medium">Total Flota</p>
            <h4 class="text-3xl font-bold mt-1">${total}</h4>
        </div>
        <div class="glass-card p-6 border-l-4 border-emerald-500">
            <p class="text-sm text-gray-400 font-medium">Operativos</p>
            <h4 class="text-3xl font-bold mt-1 text-emerald-400">${ops}</h4>
        </div>
        <div class="glass-card p-6 border-l-4 border-red-500">
            <p class="text-sm text-gray-400 font-medium">Inoperativos</p>
            <h4 class="text-3xl font-bold mt-1 text-red-400">${inops}</h4>
        </div>
        <div class="glass-card p-6 border-l-4 border-orange-500">
            <p class="text-sm text-gray-400 font-medium">Disponibles</p>
            <h4 class="text-3xl font-bold mt-1 text-orange-400">${disp}</h4>
        </div>
    `;
}

function renderSituationsTable(situations) {
    const tbody = document.getElementById('situations-table-body');
    tbody.innerHTML = situations.map(s => `
        <tr class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 font-bold text-blue-400">${s.MATRICULA}</td>
            <td class="px-6 py-4">${s.TIPOAERONAVE}</td>
            <td class="px-6 py-4">
                <span class="status-badge ${getBadgeClass(s.IDCONDICION)}">${s.CONDICION_NOMBRE}</span>
            </td>
            <td class="px-6 py-4 text-gray-400">${s.UBICACION_NOMBRE}</td>
            <td class="px-6 py-4 text-gray-400">${new Date(s.FECHA).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function renderParteTable(records) {
    const tbody = document.getElementById('parte-table-body');
    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500 italic">No hay registros para la fecha seleccionada</td></tr>`;
        return;
    }
    tbody.innerHTML = records.map(r => `
        <tr class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4">
                <div class="font-bold">${r.TIPOAERONAVE}</div>
                <div class="text-xs text-gray-500">ID: ${r.IDTIPOAERONAVE_EXT}</div>
            </td>
            <td class="px-6 py-4 text-center font-bold">${r.EFECTIVO}</td>
            <td class="px-6 py-4 text-center text-red-400 font-bold">${r.INOPERATIVOS}</td>
            <td class="px-6 py-4 text-center text-orange-400 font-bold">${r.DISPONIBLES}</td>
            <td class="px-6 py-4 text-center text-emerald-400 font-bold">${r.OPERATIVOS}</td>
            <td class="px-6 py-4 text-gray-400 text-sm">${new Date(r.FECHACRE).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function getBadgeClass(id) {
    switch (id) {
        case 1: return 'badge-op';
        case 2: return 'badge-inop';
        case 3: return 'badge-disp';
        default: return '';
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    msgEl.textContent = message;

    toast.classList.remove('translate-y-20', 'opacity-0');

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}
