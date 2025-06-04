const sql = require('../models/modelsClienteDireccion'); 

// GET /api/cliente-direcciones
exports.getAllClienteDirecciones = async (req, res) => {
    try {
        const result = await sql.selectAllClienteDirecciones();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// GET /api/cliente-direcciones/:clienteId/:direccionId
exports.getClienteDireccionByIds = async (req, res) => {
    const clienteId = parseInt(req.params.clienteId, 10);
    const direccionId = parseInt(req.params.direccionId, 10);
    try {
        const result = await sql.selectClienteDireccionByIds(clienteId, direccionId);
        if (!result) {
            return res.status(404).json({ msg: 'Relación cliente-dirección no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/cliente-direcciones
exports.createClienteDireccion = async (req, res) => {
    const { clienteId, direccionId, estado } = req.body;
    if (!clienteId || !direccionId) {
        return res.status(400).json({ msg: 'clienteId y direccionId son necesarios' });
    }
    try {
        const result = await sql.insertClienteDireccion(clienteId, direccionId, estado);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// PUT /api/cliente-direcciones/:clienteId/:direccionId
exports.updateClienteDireccionEstado = async (req, res) => {
    const clienteId = parseInt(req.params.clienteId, 10);
    const direccionId = parseInt(req.params.direccionId, 10);
    const { estado } = req.body;
    try {
        const result = await sql.updateClienteDireccionEstado(clienteId, direccionId, estado);
        if (!result) {
            return res.status(404).json({ msg: 'Relación cliente-dirección no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// DELETE /api/cliente-direcciones/:clienteId/:direccionId
exports.deleteClienteDireccion = async (req, res) => {
    const clienteId = parseInt(req.params.clienteId, 10);
    const direccionId = parseInt(req.params.direccionId, 10);
    try {
        const result = await sql.deleteClienteDireccion(clienteId, direccionId);
        if (!result) {
            return res.status(404).json({ msg: 'Relación cliente-dirección no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};