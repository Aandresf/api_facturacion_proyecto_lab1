const sql = require('../models/modelsCategoria');

exports.getAllCategorias = async (req, res) => {
    /**
    #swagger.tags = ['Categorias']
    #swagger.summary = 'Obtener todas las categorias'
    #swagger.description = 'Devuelve una lista de todas las categorias.'
    #swagger.responses[200] = { description: 'Lista de categorias'}
    #swagger.responses[500] = { description: 'Error al realizar la operacion'}
    */

    try {
        const result = await sql.selectAllCategorias();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}


// GET /api/categorias/:id
exports.getCategoriaById = async (req, res) => {
    /**
     * #swagger.tags = ['Categorias']
     * #swagger.summary = 'Obtener categoria por id'
     * #swagger.description = 'Devuelve una categoria por id.'
     * #swagger.parameters['id'] = { description: 'ID de la categoria', type: 'integer' }
     * #swagger.responses[200] = { description: 'Categoria encontrada'}
     * #swagger.responses[404] = { description: 'Categoria no encontrada'}
     * #swagger.responses[500] = { description: 'Error al realizar la operacion'}
     */

    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectCategoriaById(id);
        if (result.length === 0) {
            return res.status(404).json({ msg: 'Categoria no encontrada' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// POST /api/categorias
exports.createCategoria = async (req, res) => {
    /**
     
     * #swagger.tags = ['Categorias']
     * #swagger.summary = 'Crear categoria'
     * #swagger.description = 'Crea una nueva categoria.'
     * #swagger.parameters['descripcion'] = { description: 'Descripcion de la categoria', type: 'string', example: 'Categoria de prueba' }
     * #swagger.parameters['tipo'] = { description: 'Tipo de la categoria', type: 'string', enum: ['PRODUCTO', 'SERVICIO'], example: 'PRODUCTO' }
     * #swagger.responses[201] = { description: 'Categoria creada'}
     * #swagger.responses[400] = { description: 'Error de validacion'}
     * #swagger.responses[500] = { description: 'Error al realizar la operacion'}
     */

    const { descripcion, tipo } = req.body;
    if (!descripcion || !tipo) {
        return res.status(400).json({ msg: 'descripcion y tipo son necesarios' });
    }
    const categoria = { descripcion, tipo };

    try {
        const result = await sql.insertCategoria(categoria);
        res.status(201).json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// PUT /api/categorias:id
exports.updateCategoria = async (req, res) => {
    /**
     * #swagger.tags = ['Categorias']
     * #swagger.summary = 'Actualizar categoria'
     * #swagger.description = 'Actualiza una categoria existente.'
     * #swagger.parameters['id'] = { description: 'ID de la categoria', type: 'integer', required: true }
     * #swagger.parameters['descripcion'] = { description: 'Descripcion de la categoria', type: 'string' }
     * #swagger.parameters['tipo'] = { description: 'Tipo de la categoria', type: 'string' }
     * #swagger.responses[200] = { description: 'Categoria actualizada'}
     * #swagger.responses[404] = { description: 'Categoria no encontrada'}
     * #swagger.responses[500] = { description: 'Error al realizar la operacion'}
     */

    const id = parseInt(req.params.id, 10);
    const { descripcion, tipo, estado } = req.body;
    const categoria = { id, descripcion, tipo, estado };

    try {
        const result = await sql.updateCategoria(categoria);
        if (result === false) {
            return res.status(404).json({ msg: 'Categoria no encontrada' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// DELETE /api/categorias:id
exports.deleteCategoria = async (req, res) => {
    /**
     * #swagger.tags = ['Categorias']
     * #swagger.summary = 'Eliminar categoria'
     * #swagger.description = 'Elimina una categoria existente.'
     * #swagger.parameters['id'] = { description: 'ID de la categoria', type: 'integer', required: true }
     * #swagger.responses[200] = { description: 'Categoria eliminada'}
     * #swagger.responses[404] = { description: 'Categoria no encontrada'}
     * #swagger.responses[500] = { description: 'Error al realizar la operacion'}
     */

    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteCategoria(id);
        if (result === false) {
            return res.status(404).json({ msg: 'Categoria no encontrada' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/**
 * Validar categoria
 * @param {int} cat 
 * @returns 
 */
exports.validateCategoria = async (cat) => {
    cat = parseInt(cat, 10);
    let e = {}

    // Validamos formato de categoria_id
    if (isNaN(cat) || cat <= 0) {
        e.cat = 'Categoria Invalida'
    } else if (await sql.selectCategoriaById(cat).length === 0) {
        e.cat = 'Categoria no existe'
    }

    // Verificamos que no hayan errores
    if (Object.keys(e).length > 0) {
        return e;
    } else {
        return true;
    }
}