import db from '../utils/db.js';

// Función para obtener todas las relaciones cliente-dirección
export const selectAllClienteDirecciones = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM cliente_direcciones';
    try {
        const result = await connect.query(sql);
        return result.rows;
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};

// Función para obtener una relación cliente-dirección por ID de cliente y ID de dirección
export const selectClienteDireccionByIds = async (clienteId, direccionId) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM cliente_direcciones WHERE cliente_id = $1 AND direccion_id = $2';
    try {
        const result = await connect.query(sql, [clienteId, direccionId]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};

// Función para crear una nueva relación cliente-dirección
export const insertClienteDireccion = async (clienteId, direccionId, estado = 1) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO cliente_direcciones (cliente_id, direccion_id, estado) VALUES ($1, $2, $3) RETURNING *';
    try {
        const result = await connect.query(sql, [clienteId, direccionId, estado]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};

// Función para actualizar el estado de una relación cliente-dirección
export const updateClienteDireccionEstado = async (clienteId, direccionId, estado) => {
    const connect = await db.connect();
    let sql = 'UPDATE cliente_direcciones SET estado = $1 WHERE cliente_id = $2 AND direccion_id = $3 RETURNING *';
    try {
        const result = await connect.query(sql, [estado, clienteId, direccionId]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};

// Función para eliminar una relación cliente-dirección
export const deleteClienteDireccion = async (clienteId, direccionId) => {
    const connect = await db.connect();
    let sql = 'DELETE FROM cliente_direcciones WHERE cliente_id = $1 AND direccion_id = $2 RETURNING *';
    try {
        const result = await connect.query(sql, [clienteId, direccionId]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};