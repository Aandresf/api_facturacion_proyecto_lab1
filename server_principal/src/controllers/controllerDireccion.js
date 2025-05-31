const sql = require('../models/modelsDireccion'); 

// GET /api/direcciones
exports.getAllDirecciones = async (req, res) => {
    try {
        const result = await sql.selectAllDirecciones();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// GET /api/direcciones/:id
exports.getDireccionById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectDireccionById(id);
        if (!result) {
            return res.status(404).json({ msg: 'Dirección no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// GET /api/direcciones/cliente/:clienteId
exports.getDireccionesByClienteId = async (req, res) => {
    const clienteId = parseInt(req.params.clienteId, 10);
    try {
        const result = await sql.selectDireccionesByClienteId(clienteId);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/direcciones
exports.createDireccion = async (req, res) => {
    const { pais, estado, municipio, parroquia, sector, calle, casa } = req.body;
    if (!pais || !estado || !municipio || !parroquia || !sector || !calle || !casa) {
        return res.status(400).json({ msg: 'Todos los campos son necesarios' });
    }
    const direccion = { pais, estado, municipio, parroquia, sector, calle, casa };

    try {
        const result = await sql.insertDireccion(direccion);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// PUT /api/direcciones/:id
exports.updateDireccion = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { pais, estado, municipio, parroquia, sector, calle, casa } = req.body;
    const direccion = { pais, estado, municipio, parroquia, sector, calle, casa };

    try {
        const result = await sql.updateDireccion(id, direccion);
        if (!result) {
            return res.status(404).json({ msg: 'Dirección no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// DELETE /api/direcciones/:id
exports.deleteDireccion = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteDireccion(id);
        if (!result) {
            return res.status(404).json({ msg: 'Dirección no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/direcciones/:clienteId
exports.createDireccionForCliente = async (req, res) => {
    const clienteId = parseInt(req.params.clienteId, 10);
    const { pais, estado, municipio, parroquia, sector, calle, casa } = req.body;
    if (!pais || !estado || !municipio || !parroquia || !sector || !calle || !casa) {
        return res.status(400).json({ msg: 'Todos los campos son necesarios' });
    }
    const direccion = { pais, estado, municipio, parroquia, sector, calle, casa };

    try {
        const result = await sql.insertDireccion(direccion, clienteId);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};