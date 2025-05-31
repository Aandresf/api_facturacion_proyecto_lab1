import db from '../utils/db.js';

export const selectAllCorreo = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM correo';
    try {
        const result = await connect.query(sql);
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const selectCorreoById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM correo WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const selectCorreoByClienteId = async (clienteId) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM correo WHERE cliente_id = $1';
    try {
        const result = await connect.query(sql, [clienteId]
        );
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const insertCorreo = async (correo) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO correo (cliente_id, descripcion, dominio, estado) VALUES ($1, $2, $3, $4) RETURNING *';
    try {
        const result = await connect.query(sql, [correo.cliente, correo.descripcion, correo.dominio, '1']);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const updateCorreo = async (correo) => {
    const correoAux = await selectCorreoById(correo.pk_id);
    if (correoAux.length === 0) {
        return null; // No se encontró el correo a actualizar
    } else {
        correo.cliente = correo.cliente || correoAux[0].cliente_id;
        correo.descripcion = correo.descripcion || correoAux[0].descripcion;
        correo.dominio = correo.dominio || correoAux[0].dominio;
        correo.estado = correo.estado || correoAux[0].estado;
    }

    const connect = await db.connect();
    let sql = 'UPDATE correo SET cliente_id = $1, descripcion = $2, dominio = $3, estado = $4 WHERE id = $5 RETURNING *';
    try {
        const result = await connect.query(sql, [correo.cliente, correo.descripcion, correo.dominio, correo.estado, correo.pk_id]);
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const deleteCorreo = async (id) => {
    const connect = await db.connect();
    let sql = 'UPDATE correo SET estado = $1 WHERE id = $2 RETURNING *';
    try {
        const result = await connect.query(sql, ['2', id]);
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};