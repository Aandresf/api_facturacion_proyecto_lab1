/*
tabla subTipo de productos
hereda de item
necesita un item_id

PRODUCTOS{
    id,
    item_id,
    stock,
    precio,
    coste
}
    
 */

import db from '../utils/db.js';
import { selectItemById } from './modelsItem.js';

/**
 * Busca todos los productos
 * @returns Todos los productos
 */
export const selectAllProductos = async () => {
    const connect = await db.connect();
    let sql = 'SELECT p.id, p.item_id, i.nombre, i.descripcion, p.stock, p.precio, p.coste '
    + ' FROM productos p INNER JOIN item i ON p.item_id = i.id';
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
 *  Busca un producto por su id
 * @param {number} id 
 * @returns {Promise<Array>} Todos los productos con el id dado
 */
export const selectProducto_ById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM productos WHERE id = $1';
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
 * Busca un producto por el id de su item
 * requiere un id de item
 * @param {number} item_id 
 * @returns Todos los productos con el item_id dado
 */
export const selectProducto_ByItemId = async (item_id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM productos WHERE item_id = $1';
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
 * Busca un producto por su stock
 * @returns Todos los productos con stock mayor a 0
 */
export const selectProducto_ByStock = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM productos WHERE stock > 0';
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
 * Crea un producto en la base de datos
 * @param {{item_id: number, stock: number, precio: number, coste: number}} p
 * @returns El producto creado
 */
export const insertProducto = async (p) => {
    const item = await selectItemById(p.item_id);
    if(item.length === 0){
        console.log('Item no encontrado');
        return 
    }

    const connect = await db.connect();
    let sql = 'INSERT INTO productos (item_id, stock, precio, coste) VALUES ($1, $2, $3, $4) RETURNING *';
    try {
        const result = await connect.query(sql, [p.item_id, p.stock, p.precio, p.coste]);
        console.log('Producto creado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Actualiza un producto en la base de datos
 * @param {{id: number, item_id: number, stock: number, precio: number, coste: number}} p
 * @returns El producto actualizado
 */
export const updateProducto = async (p) => {
    if(p.item_id){
        const item = await selectItemById(p.item_id);
        if(item.length === 0){
            console.error('Item no encontrado');
            return
        }
    }

    p.item_id = p.item_id || producto[0].item_id;
    p.stock = p.stock || producto[0].stock;
    p.precio = p.precio || producto[0].precio;
    p.coste = p.coste || producto[0].coste;

    const connect = await db.connect();
    let sql = 'UPDATE productos SET item_id = $1, stock = $2, precio = $3, coste = $4 WHERE id = $5 RETURNING *';
    try {
        const result = await connect.query(sql, [p.item_id, p.stock, p.precio, p.coste, p.id]);
        console.log('Producto actualizado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Elimina un producto de la base de datos
 * @param {number} id
 * @returns El producto eliminado
 */

export const deleteProducto = async (id) => {
    const producto = await selectProducto_ById(id);
    if(producto.length === 0){
        console.error('Producto no encontrado');
        return
    }

    const connect = await db.connect();
    let sql = 'UPDATE productos SET estado = $1 WHERE id = $2 RETURNING *';
    try {
        const result = await connect.query(sql, ['2', id]);
        console.log('Producto eliminado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

/**
 * Optiene todos los productos, con su item correspondiente
 * @returns Todos los productos eliminados
 */

export const selectAllProductos_joinItems = async () => {
    const connect = await db.connect();

    let sql = 'SELECT ' +
    'p.producto_id, p.item_id, '+
    'p.item_nombre as nombre, '+
    'p.item_descripcion as descripcion, '+
    'p.categoria_id as categoria_id, '+
    'p.categoria_descripcion as categoria_descripcion, '+
    'p.producto_stock as stock, '+
    'p.producto_precio as precio, '+
    'p.producto_coste as coste  '+

    'FROM vista_productos_con_categoria p ' +
    'WHERE p.item_tipo = \'PRODUCTO\'';

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
 * Optiene un producto por su id, con su item correspondiente
 * @param {number} id
 * @returns Todos los productos eliminados
 */

export const selectProducto_ById_joinItems = async (id) => {
    const connect = await db.connect();

    let sql = 'SELECT ' +
    'p.producto_id, p.item_id, '+
    'p.item_nombre as nombre, '+
    'p.item_descripcion as descripcion, '+
    'p.categoria_id as categoria_id, '+
    'p.categoria_descripcion as categoria_descripcion, '+
    'p.producto_stock as stock, '+
    'p.producto_precio as precio, '+
    'p.producto_coste as coste  '+

    'FROM vista_productos_con_categoria p ' +
    'WHERE p.producto_id = $1';

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