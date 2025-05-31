import db from '../utils/db.js';

/**
 * Busca todas las facturas
 * @returns Todas las facturas
 */
export const selectAllFacturas = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM factura';
    try {
        const result = await connect.query(sql);
        console.log('Facturas encontradas');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Busca una factura por su ID
 * @param {number} id
 * @returns La factura encontrada
 */
export const selectFacturaById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM factura WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Factura encontrada');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Inserta una nueva factura
 * @param {{orden_id: number, serie: string, numero: string, fecha: string, estado: string}} factura
 * @returns La factura creada
 */
export const insertFactura = async (factura) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO factura (orden_id, serie, numero, fecha, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    try {
        const result = await connect.query(sql, [
            factura.orden_id,
            factura.serie,
            factura.numero,
            factura.fecha || new Date().toISOString().split('T')[0],
            factura.estado
        ]);
        console.log('Factura creada');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Actualiza una factura
 * @param {{id: number, orden_id: number, serie: string, numero: string, fecha: string, estado: string}} factura
 * @returns La factura actualizada
 */
export const updateFactura = async (factura) => {
    const facturaAux = await selectFacturaById(factura.id);
    if (!facturaAux) {
        return null; // No se encontró la factura a actualizar
    }
    factura.orden_id = factura.orden_id || facturaAux.orden_id;
    factura.serie = factura.serie || facturaAux.serie;
    factura.numero = factura.numero || facturaAux.numero;
    factura.fecha = factura.fecha || facturaAux.fecha;
    factura.estado = factura.estado || facturaAux.estado;
    
    const connect = await db.connect();
    let sql = 'UPDATE factura SET orden_id = $1, serie = $2, numero = $3, fecha = $4, estado = $5 WHERE id = $6 RETURNING *';
    try {
        const result = await connect.query(sql, [
            factura.orden_id,
            factura.serie,
            factura.numero,
            factura.fecha,
            factura.estado,
            factura.id
        ]);
        console.log('Factura actualizada');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Elimina una factura
 * @param {number} id
 * @returns La factura eliminada
 */
export const deleteFactura = async (id) => {
    const connect = await db.connect();
    let sql = 'DELETE FROM factura WHERE id = $1 RETURNING *';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Factura eliminada');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};