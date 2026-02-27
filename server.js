const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos desde la raíz del proyecto

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. Verificar conexión
app.get('/api/test-db', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        res.json({ status: 'success', message: 'Conectado a MySQL EOFAP' });
        connection.release();
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 2. Obtener resumen del Parte Diario (Caso de Uso 3)
app.get('/api/resumen-diario', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM TT_PARTE_DIARIO WHERE FECHAPARTE = CURDATE()');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 3. Registrar situación de aeronave (Caso de Uso 2)
app.post('/api/registrar-situacion', async (req, res) => {
    const { fecha, id_condicion, id_ubicacion, matricula, tipo_aeronave, observacion, total_horas, cod_unidad, sigla } = req.body;
    try {
        // Obtener el siguiente ID manualmente si no es autoincremental
        const [maxIdRows] = await pool.query('SELECT MAX(ID) as maxId FROM TT_SITUACION');
        const nextId = (maxIdRows[0].maxId || 0) + 1;

        const [result] = await pool.query(
            'INSERT INTO TT_SITUACION (ID, FECHA, IDCONDICION, IDUBICACION, MATRICULA, TIPOAERONAVE, OBSERVACION, TOTALHORAS, CODUNIDAD, SIGLA) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nextId, fecha || new Date(), id_condicion, id_ubicacion, matricula, tipo_aeronave, observacion, total_horas, cod_unidad, sigla]
        );
        res.json({ status: 'success', id: nextId });
    } catch (error) {
        console.error('Error al insertar situación:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});


// 4. Generar Parte Diario (Procesamiento/Agregación)
app.post('/api/generar-parte-diario', async (req, res) => {
    try {
        // 1. Obtener agregación de situacion actual
        const [agregacion] = await pool.query(`
            SELECT 
                TIPOAERONAVE, 
                SUM(CASE WHEN IDCONDICION = 1 THEN 1 ELSE 0 END) as OPERATIVOS,
                SUM(CASE WHEN IDCONDICION = 2 THEN 1 ELSE 0 END) as INOPERATIVOS,
                SUM(CASE WHEN IDCONDICION = 3 THEN 1 ELSE 0 END) as DISPONIBLES,
                COUNT(*) as EFECTIVO
            FROM TT_SITUACION
            WHERE DATE(FECHA) = CURDATE()
            GROUP BY TIPOAERONAVE
        `);

        if (agregacion.length === 0) {
            return res.json({ status: 'warning', message: 'No hay datos de situación para hoy' });
        }

        // 2. Limpiar reportes previos de hoy para evitar duplicados
        await pool.query('DELETE FROM TT_PARTE_DIARIO WHERE FECHAPARTE = CURDATE()');

        // 3. Insertar nuevos registros agregados
        for (const item of agregacion) {
            const [maxIdRows] = await pool.query('SELECT MAX(ID) as maxId FROM TT_PARTE_DIARIO');
            const nextId = (maxIdRows[0].maxId || 0) + 1;

            await pool.query(
                'INSERT INTO TT_PARTE_DIARIO (ID, FECHAPARTE, TIPOAERONAVE, OPERATIVOS, INOPERATIVOS, DISPONIBLES, EFECTIVO, FECHACRE, USUARIOCRE) VALUES (?, CURDATE(), ?, ?, ?, ?, ?, NOW(), ?)',
                [nextId, item.TIPOAERONAVE, item.OPERATIVOS, item.INOPERATIVOS, item.DISPONIBLES, item.EFECTIVO, 'SISTEMA']
            );
        }

        res.json({ status: 'success', message: 'Parte Diario generado exitosamente' });
    } catch (error) {
        console.error('Error al generar parte diario:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 5. Obtener catálogo de condiciones y ubigeo
app.get('/api/catalogos', async (req, res) => {
    try {
        const [condiciones] = await pool.query('SELECT * FROM TM_CONDICION');
        const [ubigeo] = await pool.query('SELECT * FROM TM_UBIGEO_FAP LIMIT 100'); // Limitado para el ejemplo
        res.json({ condiciones, ubigeo });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Situación de Aeronaves ejecutándose en el puerto ${PORT}`);
});
