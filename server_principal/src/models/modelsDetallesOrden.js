import db from '../utils/db.js';

/**
 * Busca todos los detalles de órdenes
 * @returns Todos los detalles de órdenes
 */
export const selectAllDetallesOrden = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM detalles_orden';
    try {
        const result = await connect.query(sql);
        console.log('Detalles de órdenes encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const selectDetalleById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM detalles_orden WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Detalle de orden encontrado');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
}

/**
 * Busca los detalles de una orden por su ID
 * @param {number} ordenId
 * @returns Los detalles de la orden
 */
export const selectDetallesOrdenByOrdenId = async (ordenId) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM detalles_orden WHERE orden_id = $1';
    try {
        const result = await connect.query(sql, [ordenId]);
        //console.log('Detalles de la orden encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Inserta un nuevo detalle de orden
 * @param {{orden_id: number, item_id: number, cantidad: number, subtotal: number, impuesto_aplicado: number, descuento_aplicado: number}} detalle
 * @returns El detalle de orden creado
 */
export const insertDetalleOrden = async (detalle) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO detalles_orden (orden_id, item_id, cantidad, subtotal, impuesto_aplicado, descuento_aplicado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    try {
        const result = await connect.query(sql, [
            detalle.orden_id,
            detalle.item_id,
            detalle.cantidad,
            detalle.subtotal,
            detalle.impuesto_aplicado,
            detalle.descuento_aplicado
        ]);
        console.log('Detalle de orden creado');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Actualiza un detalle de orden
 * @param {{id: number, orden_id: number, item_id: number, cantidad: number, subtotal: number, impuesto_aplicado: number, descuento_aplicado: number}} detalle
 * @returns El detalle de orden actualizado
 */
export const updateDetalleOrden = async (detalle) => {
    const detalleAux = await selectDetalleById(detalle.id);
    if (!detalleAux) {
        console.error('Detalle de orden no encontrado');
        return null;
    } else {
        detalle.orden_id = detalle.orden_id || detalleAux.orden_id;
        detalle.item_id = detalle.item_id || detalleAux.item_id;
        detalle.cantidad = detalle.cantidad || detalleAux.cantidad;
        detalle.subtotal = detalle.subtotal || detalleAux.subtotal;
        detalle.impuesto_aplicado = detalle.impuesto_aplicado || detalleAux.impuesto_aplicado;
        detalle.descuento_aplicado = detalle.descuento_aplicado || detalleAux.descuento_aplicado;
    }
    const connect = await db.connect();
    let sql = 'UPDATE detalles_orden SET orden_id = $1, item_id = $2, cantidad = $3, subtotal = $4, impuesto_aplicado = $5, descuento_aplicado = $6 WHERE id = $7 RETURNING *';
    try {
        const result = await connect.query(sql, [
            detalle.orden_id,
            detalle.item_id,
            detalle.cantidad,
            detalle.subtotal,
            detalle.impuesto_aplicado,
            detalle.descuento_aplicado,
            detalle.id
        ]);
        console.log('Detalle de orden actualizado');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Elimina un detalle de orden
 * @param {number} id
 * @returns El detalle de orden eliminado
 */
export const deleteDetalleOrden = async (id) => {
    const connect = await db.connect();
    let sql = 'DELETE FROM detalles_orden WHERE id = $1 RETURNING *';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Detalle de orden eliminado');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};