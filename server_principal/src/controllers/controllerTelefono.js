const sql = require('../models/modelsTelefono');

// GET /api/telefonos
exports.getAllTelefonos = async (req, res) => {
    try {
        console.log('Iniciando consulta de teléfonos...');
        const result = await sql.selectAllTelefono();
        console.log('Resultados Obtenidos (teléfonos):', result);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación (teléfonos)' });
    }
};

// GET /api/telefonos/:id
exports.getTelefonoById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectTelefonoById(id);
        if (result && result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ msg: 'Teléfono no encontrado' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación (teléfono por ID)' });
    }
};

// POST /api/telefonos
exports.createTelefono = async (req, res) => {
    const { cliente, pais, operadora, numero } = req.body;
    console.log('Datos recibidos (teléfono):', { cliente, pais, operadora, numero });
    if (!cliente || !pais || !operadora || !numero) {
        return res.status(400).json({ msg: 'cliente, pais, operadora y numero son necesarios' });
    }
    const telefono = { cliente, pais, operadora, numero };

    try {
        const result = await sql.insertTelefono(telefono);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación (crear teléfono)' });
    }
};

// PUT /api/telefonos/:id
exports.updateTelefono = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { cliente, pais, operadora, numero, estado } = req.body;
    const telefono = { pk_id: id, cliente, pais, operadora, numero, estado };

    try {
        const result = await sql.updateTelefono(telefono);
        if (result && result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ msg: 'Teléfono no encontrado para actualizar' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación (actualizar teléfono)' });
    }
};

// DELETE /api/telefonos/:id
exports.deleteTelefono = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteTelefono(id);
        if (result && result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ msg: 'Teléfono no encontrado para eliminar' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación (eliminar teléfono)' });
    }
};

/**
 * Validar teléfono
 * @param {int} tel
 * @returns 
 */
exports.validateTelefono = async (tel) => {
    tel = parseInt(tel, 10);
    let e = {};

    // Validamos formato de pk_id (teléfono ID)
    if (isNaN(tel) || tel <= 0) {
        e.tel = 'Teléfono inválido';
    } else if ((await sql.selectTelefonoById(tel)).length === 0) {
        e.tel = 'Teléfono no existe';
    }

    // Verificamos que no hayan errores
    if (Object.keys(e).length > 0) {
        return e;
    } else {
        return true;
    }
};