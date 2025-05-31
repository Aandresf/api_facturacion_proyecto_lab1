const sql = require('../models/modelsItem');

// GET /api/items
exports.getAllItems = async (req, res) => {
    const { nombre, categoria_id, tipo } = req.body;
    try {
        let result;
        if(nombre && categoria_id && tipo) {
            result = await sql.selectItemByNombreCategoriaTipo(nombre, categoria_id, tipo);
        } else if (nombre) {
            result = await sql.selectItemByNombre(nombre);
        } else {
            result = await sql.selectAllItems();
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/** GET /api/items/:id
 * Obtiene el item por el id dado
 * @param {number} id
 * @returns {Object} El item buscado
 */
exports.getItemById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectItemById(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// GET /api/items/categoria/:id
exports.getItemByCategoriaId = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { nombre } = req.body;
    try {
        let result
        if(nombre) {
            result = await sql.selectItemByNombreCategoria(nombre, id);
        } else {
            result = await sql.selectItemByCategoriaId(id);
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// GET /api/items/tipo/:tipo
exports.getItemByTipo = async (req, res) => {
    const tipo = req.params.tipo;
    const { nombre } = req.body;
    try {
        let result;
        if(nombre) {
            result = await sql.selectItemByNombreTipo(nombre, tipo);
        } else{
            result = await sql.selectItemByTipo(tipo);
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// POST /api/items
exports.createItem = async (req, res) => {
    const { nombre, descripcion, categoria_id, tipo } = req.body;
    if (!nombre || !descripcion || !categoria_id || !tipo) {
        return res.status(400).json({ msg: '{nombre, descripcion, categoria_id, tipo} son necesarios' });
    }
    const item = { nombre, descripcion, categoria_id, tipo };

    try {
        const result = await sql.insertItem(item);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// PUT /api/items:id
exports.updateItem = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const {nombre, descripcion, categoria_id, tipo, estado } = req.body;
    const item = { id, nombre, descripcion, categoria_id, tipo, estado };

    try {
        const result = await sql.updateItem(item);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/**
 * DELETE /api/items/id
 * @param {{id:number}} req
 * @returns El item eliminado
 */
exports.deleteItem = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteItem(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}