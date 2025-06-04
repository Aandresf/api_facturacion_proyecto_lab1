/*
relaciona los ajustes de precio con con los items
cada item tiene varios ajustes de precio
necesita un item_id y un ajuste_id

ITEM_AJUSTE{
    id
    item_id
    ajuste_precio_id (Impuesto)
}

*/

import db from '../utils/db.js';
//const db = require('../utils/db');


/**
 * Busca todos los item_ajuste
 * @returns Todos los item_ajuste
 */

export const selectAllItemAjuste = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item_ajuste';
    try {
        const result = await connect.query(sql);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Busca un item_ajuste por su id
 * @param {number} id
 * @returns Todos los item_ajuste con el id dado
 */

export const selectItemAjuste_ById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item_ajuste WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Busca un item_ajuste por el id de su item
 * @param {number} item_id
 * @returns Todos los item_ajuste con el item_id dado
 */

export const selectItemAjuste_ByItemId = async (item_id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item_ajuste WHERE item_id = $1';
    try {
        const result = await connect.query(sql, [item_id]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Busca un item_ajuste por el id de su ajuste
 * @param {number} ajuste_precio_id
 * @returns Todos los item_ajuste con el ajuste_precio_id dado
 */

export const selectItemAjuste_ByAjusteId = async (ajustePrecio_id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item_ajuste WHERE ajuste_precio_id = $1';
    try {
        const result = await connect.query(sql, [ajustePrecio_id]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Busca un item_ajuste por el id de su item y el id de su ajuste
 * @param {{item_id:number, ajuste_precio_id:number }} i
 * @returns Todos los item_ajuste con el item_id y ajuste_precio_id dado
 */

export const selectItemAjuste_ByItemIdAjusteId = async (i) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item_ajuste WHERE item_id = $1 AND ajuste_precio_id = $2';
    try {
        const result = await connect.query(sql, [i.id_item, i.id_ajuste]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Crea un item_ajuste
 * @param {{item_id:number, ajuste_precio_id:number }} i
 * @returns El item_ajuste creado
 */

export const insertItemAjuste = async (i) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO item_ajuste (item_id, ajuste_precio_id) VALUES ($1, $2) RETURNING *';
    try {
        const result = await connect.query(sql, [i.item_id, i.ajuste_precio_id]);
        console.log('Item_ajuste creado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Actualiza un item_ajuste
 * @param {{id:number, item_id:number, ajuste_precio_id:number }} i
 * @returns El item_ajuste actualizado
 */

export const updateItemAjuste = async (i) => {
    const item = await selectItemAjuste_ById(i.id);
    if(!item){
        console.error('Item_ajuste no encontrado');
        return;
    } else {
        i.item_id = i.item_id || item[0].item_id;
        i.ajuste_precio_id = i.ajuste_precio_id || item[0].ajuste_precio_id;
    }

    const connect = await db.connect();
    let sql = 'UPDATE item_ajuste SET item_id = $1, ajuste_precio_id = $2 WHERE id = $3 RETURNING *';
    try {
        const result = await connect.query(sql, [i.item_id, i.ajuste_precio_id, i.id]);
        console.log('Item_ajuste actualizado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Elimina un item_ajuste
 * @param {number} id
 * @returns El item_ajuste eliminado
 */

export const deleteItemAjuste = async (id) => {
    const connect = await db.connect();
    let sql = 'UPDATE item_ajuste SET estado = $1 WHERE id = $2 RETURNING *';
    try {
        const result = await connect.query(sql, ['2', id]);
        console.log('Item_ajuste eliminado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Busca por Id y devuelve el nombre del ajuste y el valor
 * @param {number} id
 * @returns Valores del ajuste encontrado
 */
export const selectItemAjuste_byId_joinAjustePrecio = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT ia.id, aP.descripcion, aP.valor '+ 
        'FROM ajuste_precio aP '+
        'INNER JOIN item_ajuste iA ON iA.ajuste_precio_id = aP.id '+
        'WHERE iA.id  = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Busca por Item y devuelve el nombre del ajuste y el valor
 * @param {number} item_id
 * @returns Valores del ajuste encontrado
 */
export const selectItemAjuste_byItem_joinAjustePrecio = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT ia.id, ap.tipo,  aP.descripcion, aP.valor '+ 
        'FROM ajuste_precio aP '+
        'INNER JOIN item_ajuste iA ON iA.ajuste_precio_id = aP.id '+
        'WHERE iA.item_id  = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}