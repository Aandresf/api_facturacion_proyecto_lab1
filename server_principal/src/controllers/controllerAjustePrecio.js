const sql = require('../models/modelsAjustePrecio');
const sqlItemAjuste = require('../models/modelsItemAjuste');

// GET /api/ajusteprecio
exports.getAllAjustePrecio = async (req, res) => {
    // #swagger.tags = ['Ajuste Precio']
    const { tipo, aplicable_a } = req.body;
    try {
        let result;
        if (tipo && aplicable_a) {
            result = await sql.selectAjustePrecioByTipoaplicable_a(tipo, aplicable_a);
        } else if (tipo) {
            result = await sql.selectAjustePrecioByTipo(tipo);
        } else if (aplicable_a) {
            result = await sql.selectAjustePrecioByaplicable_a(aplicable_a);
        } else {
            result = await sql.selectAllAjustePrecio();
        }
        
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// GET /api/ajusteprecio/:id
exports.getAjustePrecioById = async (req, res) => {
    // #swagger.tags = ['Ajuste Precio']
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectAjustePrecioById(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/** Busca todos los ajustes de precio del item especificado
 * @param {number} item_id  
 * @returns {Array} Todos los ajustes, con detalles, del item
 */
exports.getAjustesByItem = async (item_id) => {
    // #swagger.tags = ['Ajuste Precio']
    const item = parseInt(item_id, 10)
    try {
        const result = await sqlItemAjuste.selectItemAjuste_byItem_joinAjustePrecio(item)
        return result
        
    } catch (error) {
        console.error(error.message);
        return null
    }
}

// POST /api/ajusteprecio
exports.createAjustePrecio = async (req, res) => {
    // #swagger.tags = ['Ajuste Precio']
    const { descripcion, aplicable_a, tipo, valor } = req.body;
    if (!descripcion || !aplicable_a || !tipo || !valor) {
        return res.status(400).json({ msg: '{descripcion, aplicable_a, tipo, valor} son necesarios' });
    }
    const ajustePrecio = { descripcion, aplicable_a, tipo, valor };

    try {
        const result = await sql.insertAjustePrecio(ajustePrecio);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// PUT /api/ajusteprecio:id
exports.updateAjustePrecio = async (req, res) => {
    // #swagger.tags = ['Ajuste Precio']
    const id = parseInt(req.params.id, 10);
    const { descripcion, aplicable_a, tipo, valor, estado } = req.body;
    const ajustePrecio = { id, descripcion, aplicable_a, tipo, valor, estado };

    try {
        const result = await sql.updateAjustePrecio(ajustePrecio);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// DELETE /api/ajusteprecio:id
exports.deleteAjustePrecio = async (req, res) => {
    // #swagger.tags = ['Ajuste Precio']
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteAjustePrecio(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/**
 * Validar los ajustes de precio de los items
 * @param {Array} ids
 * @returns true o un objeto con arrays de errores
 */
exports.validarAjustesPrecio = async (ids) =>{
    const e = { ajust: { msg1: [], msg2: [] } }

    if (ids != undefined && ids.length > 0) {
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            // Validar que sean numeros validos y que existan
            if (isNaN(id) || id <= 0) {
                e.ajust.msg1.push(`Ajuste de precio ${id} inválido`);
            } else {
                const ajuste = await sql.selectAjustePrecioById(parseInt(id, 10));
                if (ajuste.length === 0) {
                    e.ajust.msg2.push(`Ajuste de precio ${id} no existe`);
                }
            }
        }
    }

    // Verificamos que no hayan errores
    if (e.ajust.msg1.length > 0 || e.ajust.msg2.length > 0) {
        return e;
    } else {
        return true;
    }

}

/**
 * Insertar los ajustes de precios del item
 * @param {Array} ids
 * @param {int} item
 * @returns {Array} Array con los valores de los ajustes creados
 */

exports.newAjustesPrecioForItem = async (ids, item) => {
    // Array de objetos, cada uno con la propiedad id
    let oldsAjust = await sqlItemAjuste.selectItemAjuste_ByItemId(parseInt(item, 10));

    oldsAjust = oldsAjust ? oldsAjust.map(aj => parseInt(aj.id,10)) : [];

    newAjust = [];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i]

        if (oldsAjust.includes(id)) {
            continue;
        }

        const i_A = {
            item_id: parseInt(item, 10),
            ajuste_precio_id: parseInt(id, 10)
        }

        const aux = await sqlItemAjuste.insertItemAjuste(i_A)
        const i_A_Aux = aux[0]
        i_A_Aux.id = parseInt(i_A_Aux.id,10)
        const valores = await sqlItemAjuste.selectItemAjuste_byId_joinAjustePrecio(i_A_Aux.id,10)

        newAjust.push(valores[0]);
    }

    return newAjust;
}


