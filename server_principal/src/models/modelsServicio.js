/*
tabla subTipo de servicio
hereda de la tabal item
necesita un item_id

SERVICIO{
    id,
    item_id,
    precio
}

*/

import db from '../utils/db.js';
import { selectItemById } from './modelsItem.js';

//const db = require('../utils/db');
//const { selectItemById } = require('./modelsItem');

/**
 * Busca todos los servicios
 * @returns Todos los servicios
 */

export const selectAllServicios = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM servicio';
    try {
        const result = await connect.query(sql);
        console.log('Resultados encontrados');
        return result.rows;
    }
    catch (error) {
        console.error(error.message);
    }
    finally {
        if (connect) { connect.release(); }
    }
}

/**
 *  Busca un servicio por su id
 * @param {number} id 
 * @returns Todos los servicios con el id dado
 */

export const selectServicio_ById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM servicio WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Resultados encontrados');
        return result.rows;
    }
    catch (error) {
        console.error(error.message);
    }
    finally {
        if (connect) { connect.release(); }
    }
}

/**
 * Busca un servicio por el id de su item
 * requiere un id de item
 * @param {number} item_id 
 * @returns Todos los servicios con el item_id dado
 */

export const selectServicio_ByItemId = async (item_id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM servicio WHERE item_id = $1';
    try {
        const result = await connect.query(sql, [item_id]);
        console.log('Resultados encontrados');
        return result.rows;
    }
    catch (error) {
        console.error(error.message);
    }
    finally {
        if (connect) { connect.release(); }
    }
}

/**
 * Crear un nuevo servicio
 * @param {{item_id:number, precio:number}} s
 * @returns El nuevo servicio
 */

export const createServicio = async (s) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO servicio(item_id, precio) VALUES($1, $2) RETURNING *';
    try {
        const result = await connect.query(sql, [s.item_id, s.precio]);
        console.log('Servicio creado');
        return result.rows;
    }
    catch (error) {
        console.error(error.message);
    }
    finally {
        if (connect) { connect.release(); }
    }
}

/**
 * Actualiza un servicio
 * @param {{id:number, item_id:number, precio:number}} s
 * @returns El servicio actualizado
 */

export const updateServicio = async (s) => {
    const servicio = await selectServicio_ById(s.id);
    if(servicio.length === 0){
        console.error('Servicio no encontrado');
        return;
    }
    // si se quiere cambiar el item_id, se verifica que el item exista
    if(s.item_id){
        const item = await selectItemById(s.item_id);
        if(item.length === 0){
            console.error('Item no encontrado');
            return;
        }
    }
    s.item_id = s.item_id || servicio[0].item_id;
    s.precio = s.precio || servicio[0].precio;

    const connect = await db.connect();
    let sql = 'UPDATE servicio SET item_id = $1, precio = $2 WHERE id = $3 RETURNING *';
    try {
        const result = await connect.query(sql, [s.item_id, s.precio, s.id]);
        console.log('Servicio actualizado');
        return result.rows;
    }
    catch (error) {
        console.error(error.message);
    }
    finally {
        if (connect) { connect.release(); }
    }
}

/**
 * Elimina un servicio
 * @param {number} id 
 * @returns El servicio eliminado
 */

export const deleteServicio = async (id) => {
    const servicio = await selectServicio_ById(id);
    if(servicio.length === 0){
        console.error('Servicio no encontrado');
        return;
    }
    const connect = await db.connect();
    let sql = 'DELETE FROM servicio WHERE id = $1 RETURNING *';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Servicio eliminado');
        return result.rows;
    }
    catch (error) {
        console.error(error.message);
    }
    finally {
        if (connect) { connect.release(); }
    }
}