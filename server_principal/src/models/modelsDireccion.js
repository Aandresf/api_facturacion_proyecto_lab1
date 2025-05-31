import db from '../utils/db.js';

export const selectAllDirecciones = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM direccion';
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

export const selectDireccionById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM direccion WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        return result.rows[0]; 
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};

export const selectDireccionesByClienteId = async (clienteId) => {
    const connect = await db.connect();
    let sql = 'SELECT d.* FROM direccion d INNER JOIN cliente_direcciones cd ON d.id = cd.direccion_id WHERE cd.cliente_id = $1';
    try {
        const result = await connect.query(sql, [clienteId]);
        return result.rows;
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};

export const insertDireccion = async (d) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO direccion (pais, estado, municipio, parroquia, sector, calle, casa) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    try {
        const result = await connect.query(sql, [
            d.pais, d.estado, d.municipio, d.parroquia, d.sector, d.calle, d.casa
        ]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};

export const updateDireccion = async (id, d) => {
    const dirAux = await selectDireccionById(id);
    if (!dirAux) {
        throw new Error('Dirección no encontrada');
    } else {
        d.pais = d.pais || dirAux.pais;
        d.estado = d.estado || dirAux.estado;
        d.municipio = d.municipio || dirAux.municipio;
        d.parroquia = d.parroquia || dirAux.parroquia;
        d.sector = d.sector || dirAux.sector;
        d.calle = d.calle || dirAux.calle;
        d.casa = d.casa || dirAux.casa;
    }
    const connect = await db.connect();
    let sql = 'UPDATE direccion SET pais = $1, estado = $2, municipio = $3, parroquia = $4, sector = $5, calle = $6, casa = $7 WHERE id = $8 RETURNING *';
    try {
        const result = await connect.query(sql, [
            d.pais, d.estado, d.municipio, d.parroquia, d.sector, d.calle, d.casa, id
        ]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};

export const deleteDireccion = async (id) => {
    const connect = await db.connect();
    let sql = 'DELETE FROM direccion WHERE id = $1 RETURNING *';
    try {
        const result = await connect.query(sql, [id]);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        if (connect) { connect.release(); }
    }
};