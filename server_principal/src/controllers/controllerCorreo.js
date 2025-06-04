const sql = require('../models/modelsCorreo');

exports.getAllCorreos = async (req, res) => {
    try {
        const result = await sql.selectAllCorreo();
        res.json(result);
    } catch (error) {
        res.status(500).json({ msg: 'Error al realizar la operación (correos)' });
    }
};

exports.getCorreoById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectCorreoById(id);
        if (result && result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ msg: 'Correo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error al realizar la operación (correo por ID)' });
    }
};

exports.createCorreo = async (req, res) => {
    const { cliente, descripcion, dominio } = req.body;
    if (!cliente || !descripcion || !dominio) {
        return res.status(400).json({ msg: 'cliente, descripcion y dominio son necesarios' });
    }
    const correo = { cliente, descripcion, dominio };
    try {
        const result = await sql.insertCorreo(correo);
        res.json(result);
    } catch (error) {
        res.status(500).json({ msg: 'Error al realizar la operación (crear correo)' });
    }
};

exports.updateCorreo = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { cliente, descripcion, dominio, estado } = req.body;
    const correo = { pk_id: id, cliente, descripcion, dominio, estado };
    try {
        const result = await sql.updateCorreo(correo);
        if (result && result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ msg: 'Correo no encontrado para actualizar' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error al realizar la operación (actualizar correo)' });
    }
};

exports.deleteCorreo = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteCorreo(id);
        if (result && result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ msg: 'Correo no encontrado para eliminar' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error al realizar la operación (eliminar correo)' });
    }
};

exports.validateCorreo = async (correoId) => {
    correoId = parseInt(correoId, 10);
    let e = {};
    if (isNaN(correoId) || correoId <= 0) {
        e.correo = 'Correo inválido';
    } else if ((await sql.selectCorreoById(correoId)).length === 0) {
        e.correo = 'Correo no existe';
    }
    if (Object.keys(e).length > 0) {
        return e;
    } else {
        return true;
    }
};