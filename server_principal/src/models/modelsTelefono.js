import db from '../utils/db.js';

/**
 * Busca todos los teléfonos.
 * @returns Todos los teléfonos.
 */
export const selectAllTelefono = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM telefono';
    try {
        const result = await connect.query(sql);
        console.log('Resultados encontrados (teléfonos)');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Busca un teléfono por su ID.
 * @param {number} id
 * @returns El teléfono con el ID solicitado.
 */
export const selectTelefonoById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM telefono WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Resultados encontrados (teléfono por ID)');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Inserta un nuevo teléfono.
 * @param {{cliente: number, pais: string, operadora: string, numero: string}} tel
 * @returns El nuevo teléfono registrado.
 */
export const insertTelefono = async (tel) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO telefono (CLIENTE_ID, pais, operadora, numero, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    try {
        const result = await connect.query(sql, [tel.cliente, tel.pais, tel.operadora, tel.numero, '1']); // Estado '1' por defecto (activo)
        console.log('Teléfono creado exitosamente');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Actualiza un teléfono.
 * @param {{pk_id: number, cliente: number, pais: string, operadora: string, numero: string, estado: string}} tel
 * @returns El teléfono actualizado.
 */
export const updateTelefono = async (tel) => {
    // Verifica si el teléfono existe
    const telefonoAux = await selectTelefonoById(tel.pk_id);
    if (telefonoAux.length === 0) {
        console.log('Teléfono no encontrado');
        return;
    } else {
        // Actualiza los datos si se proporcionan, o mantiene los existentes
        tel.cliente = tel.cliente || telefonoAux[0].cliente_id;
        tel.pais = tel.pais || telefonoAux[0].pais;
        tel.operadora = tel.operadora || telefonoAux[0].operadora;
        tel.numero = tel.numero || telefonoAux[0].numero;
        tel.estado = tel.estado || telefonoAux[0].estado;
    }

    // Actualiza el teléfono
    const connect = await db.connect();
    let sql = 'UPDATE telefono SET cliente_id = $1, pais = $2, operadora = $3, numero = $4, estado = $5 WHERE id = $6 RETURNING *';
    try {
        const result = await connect.query(sql, [tel.cliente, tel.pais, tel.operadora, tel.numero, tel.estado, tel.pk_id]);
        console.log('Teléfono actualizado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Elimina un teléfono (cambia el estado a '2' - inactivo).
 * @param {number} id
 * @returns El teléfono eliminado (actualizado a inactivo).
 */
export const deleteTelefono = async (id) => {
    // Verifica si el teléfono existe
    const telefonoAux = await selectTelefonoById(id);
    if (telefonoAux.length === 0) {
        console.log('Teléfono no encontrado');
        return;
    }

    // Actualiza el estado a '2' (inactivo)
    const connect = await db.connect();
    let sql = 'UPDATE telefono SET estado = $1 WHERE pk_id = $2 RETURNING *';
    try {
        const result = await connect.query(sql, ['2', id]);
        console.log('Teléfono eliminado (estado actualizado)');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};