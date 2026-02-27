const express = require('express');
const router = express.Router();
const pool = require('../db');

// List Conditions
router.get('/condiciones', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM TM_CONDICION');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List Locations
router.get('/ubicaciones', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM TM_UBIGEO_FAP');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register Situation
router.post('/situacion', async (req, res) => {
    const { FECHA, IDCONDICION, IDUBICACION, TOTALHORAS, OBSERVACION, IDTIPOAERONAVE_EXT, TIPOAERONAVE, MATRICULA, CODUNIDAD, SIGLA } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO TT_SITUACION (FECHA, IDCONDICION, IDUBICACION, TOTALHORAS, OBSERVACION, IDTIPOAERONAVE_EXT, TIPOAERONAVE, MATRICULA, CODUNIDAD, SIGLA) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [FECHA, IDCONDICION, IDUBICACION, TOTALHORAS, OBSERVACION, IDTIPOAERONAVE_EXT, TIPOAERONAVE, MATRICULA, CODUNIDAD, SIGLA]
        );
        res.status(201).json({ id: result.insertId, message: 'Situación registrada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List Situations
router.get('/situacion', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.*, c.NOMBRE as CONDICION_NOMBRE, u.LUGAR as UBICACION_NOMBRE 
            FROM TT_SITUACION s
            LEFT JOIN TM_CONDICION c ON s.IDCONDICION = c.IDCONDICION
            LEFT JOIN TM_UBIGEO_FAP u ON s.IDUBICACION = u.IDUBICACION
            ORDER BY s.FECHA DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate Daily Report (Consolidation)
router.post('/generar-parte-diario', async (req, res) => {
    const { fecha } = req.body;
    try {
        // Clear previous records for the same date to avoid duplicates (as per Skill)
        await pool.query('DELETE FROM TT_PARTE_DIARIO WHERE FECHAPARTE = ?', [fecha]);

        // Aggregate data
        const [aggregation] = await pool.query(`
            SELECT 
                TIPOAERONAVE,
                IDTIPOAERONAVE_EXT,
                COUNT(*) as EFECTIVO,
                SUM(CASE WHEN IDCONDICION = 2 THEN 1 ELSE 0 END) as INOPERATIVOS, -- ID 2 = Inoperativo (Assuming based on logic)
                SUM(CASE WHEN IDCONDICION = 3 THEN 1 ELSE 0 END) as DISPONIBLES, -- ID 3 = Disponible
                SUM(CASE WHEN IDCONDICION = 1 THEN 1 ELSE 0 END) as OPERATIVOS   -- ID 1 = Operativo
            FROM TT_SITUACION
            WHERE FECHA = ?
            GROUP BY TIPOAERONAVE, IDTIPOAERONAVE_EXT
        `, [fecha]);

        // Insert consolidated records
        for (const row of aggregation) {
            // Manual ID management if not autoincremental (as per Rules)
            const [maxIdRow] = await pool.query('SELECT IFNULL(MAX(ID), 0) + 1 as nextId FROM TT_PARTE_DIARIO');
            const nextId = maxIdRow[0].nextId;

            await pool.query(
                'INSERT INTO TT_PARTE_DIARIO (ID, TIPOAERONAVE, FECHAPARTE, IDTIPOAERONAVE_EXT, EFECTIVO, INOPERATIVOS, DISPONIBLES, OPERATIVOS, FECHACRE, USUARIOCRE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)',
                [nextId, row.TIPOAERONAVE, fecha, row.IDTIPOAERONAVE_EXT, row.EFECTIVO, row.INOPERATIVOS, row.DISPONIBLES, row.OPERATIVOS, 'SYSTEM']
            );
        }

        res.json({ message: 'Parte Diario generado exitosamente', records: aggregation.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Daily Report
router.get('/parte-diario', async (req, res) => {
    const { fecha } = req.query;
    try {
        const [rows] = await pool.query('SELECT * FROM TT_PARTE_DIARIO WHERE FECHAPARTE = ?', [fecha]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
