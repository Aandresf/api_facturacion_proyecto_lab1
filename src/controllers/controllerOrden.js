const sql = require('../models/modelsDetallesOrden');
const sqlItem = require('../models/modelsItem');
const sqlProducto = require('../models/modelsProducto');
const sqlServicio = require('../models/modelsServicio');
const sqlAjustePrecio = require('../models/modelsAjustePrecio');
const sqlOrden = require('../models/modelsOrden');

// Obtiene todas las ordenes, sin items
exports.getAllOrden = async (req, res) => {
    // #swagger.tags = ['Ordenes']
    try {
        const result = await sqlOrden.selectAllOrdenes();
        result.forEach(orden => {
            orden.fecha = orden.fecha.toISOString().split('T')[0]; // Formatear la fecha
            //orden.detalles = await sql.selectDetallesOrdenByOrdenId(orden.id);
        });

        // #swagger.response[200] = { description: 'Ordenes obtenidas' }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        // #swagger.response[500] = { description: 'Error al obtener las ordenes' }
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// Obtiene una orden con sus items
/** GET /api/ordenes/:ordenId

 * @tags Ordenes
 * @param {number} ordenId Id de la orden a buscar
 * @returns La orden seleccionada con los detalles
 */
exports.getOrdenById = async (req, res) => {
    // #swagger.tags = ['Ordenes']
    const ordenId = parseInt(req.params.ordenId, 10);
    try {
        const result = {}
        result.orden = await sqlOrden.selectOrdenById(ordenId);
        if (!result.orden) {
            console.error('ERROR 404 ORDEN NO ENCONTRADA')
            return res.status(404).json({ msg: 'Orden no encontrada' })
        }
        result.orden.fecha = result.orden.fecha.toISOString().split('T')[0]; // Formatear la fecha

        result.detalles = await sql.selectDetallesOrdenByOrdenId(ordenId);

        console.log(result);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: error.message });
    }
};

// Crea una nueva orden con sus items
/** POST /api/ordenes
 * @param {{cliente_id:number, items:[{item_id:number, cantidad:number, ajustePreciosIds:[number]}]}} req 
 * @returns La orden creada y sus detalles
 */
exports.createOrden = async (req, res) => {
    // #swagger.tags = ['Ordenes']
    const { cliente_id, items } = req.body;

    try {
        const result = [];

        // Creamos la orden
        if (!cliente_id) {
            return res.status(400).json({ msg: 'cliente_id es necesario' });
        }
        let orden = { cliente_id, fecha: new Date(), estado: 'ACTIVO' };

        console.log('Datos de la orden: ', orden);
        orden = await sqlOrden.insertOrden(orden);
        result.push(orden);

        // creamos los detalles de la orden

        for (const i of items) {
            let item = await sqlItem.selectItemById(i.item_id);
            item = item[0];

            const detalle = {
                orden_id: orden.id,
                item_id: i.item_id,
                cantidad: i.cantidad,
                subtotal: 0,
                impuesto_aplicado: 0,
                descuento_aplicado: 0
            }

            if (item.tipo === 'PRODUCTO') {
                const producto = await sqlProducto.selectProducto_ByItemId(i.item_id);

                if (producto[0].stock < i.cantidad) {
                    console.log('No hay suficiente stock para el producto:', producto[0].nombre);
                    i.cantidad = producto[0].stock; // Ajustamos la cantidad al stock disponible
                }

                // calculamos el subtotal
                detalle.subtotal = producto[0].precio * i.cantidad;

                // actualizamos el stock del producto
                await sqlProducto.updateStock(i.item_id, producto[0].stock - i.cantidad);
            }

            if (item.tipo === 'SERVICIO') {
                const servicio = await sqlServicio.selectServicio_ByItemId(i.item_id);
                detalle.subtotal = servicio[0].precio * i.cantidad;
            }

            // si hay ajustes de precio, obtenemos su valor y los acumulamos
            if (i.ajustePreciosIds.length > 0) {

                for (const ajusteId of i.ajustePreciosIds) {
                    let ajuste = await sqlAjustePrecio.selectAjustePrecioById(ajusteId);
                    ajuste = ajuste[0];
                    if (ajuste.tipo === 'IMPUESTO') {
                        detalle.impuesto_aplicado += parseFloat(ajuste.valor);
                    }
                    if (ajuste.tipo === 'DESCUENTO') {
                        detalle.descuento_aplicado += parseFloat(ajuste.valor);
                    }
                }
            }

            const nuevoDetalle = await sql.insertDetalleOrden(detalle);
            result.push(nuevoDetalle);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// crea un item, para una orden existente
/** POST /api/ordenes/:ordenId/detalle
 * @param {number} ordenId Id de la orden a la que se le va a agregar el detalle
 * @param {{item_id:number, cantidad:number, ajustePreciosIds:[number]}} req 
 * @returns El detalle creado
 */
exports.createDetalleOrden = async (req, res) => {
    // #swagger.tags = ['Ordenes']
    const ordenId = parseInt(req.params.ordenId, 10);
    const {item_id, cantidad, ajustePreciosIds = [] } = req.body;

    if (!ordenId) {
        return res.status(400).json({ msg: 'ordenId es necesario' });
    }

    try {

        let item = await sqlItem.selectItemById(item_id);
        item = item[0];

        const detalle = {
            orden_id: orden_Id,
            item_id: item_id,
            cantidad: cantidad,
            subtotal: 0,
            impuesto_aplicado: 0,
            descuento_aplicado: 0
        }

        if (item.tipo === 'PRODUCTO') {
            const producto = await sqlProducto.selectProducto_ByItemId(item_id);

            if (producto[0].stock < detalle.cantidad) {
                console.log('No hay suficiente stock para el producto:', producto[0].nombre);
                detalle.cantidad = producto[0].stock; // Ajustamos la cantidad al stock disponible
            }

            // calculamos el subtotal
            detalle.subtotal = producto[0].precio * detalle.cantidad;

            // actualizamos el stock del producto
            await sqlProducto.updateStock(item_id, producto[0].stock - detalle.cantidad);
        }

        if (item.tipo === 'SERVICIO') {
            const servicio = await sqlServicio.selectServicio_ByItemId(item_id);
            detalle.subtotal = servicio[0].precio * detalle.cantidad;
        }

        // si hay ajustes de precio, obtenemos su valor y los acumulamos
        if (ajustePreciosIds.length > 0) {

            for (const ajusteId of ajustePreciosIds) {
                let ajuste = await sqlAjustePrecio.selectAjustePrecioById(ajusteId);
                ajuste = ajuste[0];
                if (ajuste.tipo === 'IMPUESTO') {
                    detalle.impuesto_aplicado += parseFloat(ajuste.valor);
                }
                if (ajuste.tipo === 'DESCUENTO') {
                    detalle.descuento_aplicado += parseFloat(ajuste.valor);
                }
            }
        }

        const nuevoDetalle = await sql.insertDetalleOrden(detalle);

        res.status(201).json(nuevoDetalle);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// actualiza un detalle de una orden existenete
/** PUT /api/ordenes/detalle/:id
 * @param {number} id Id del detalle a actualizar
 * @param {{cantidad:number, ajustePreciosIds:[number]}} req 
 * @returns El detalle actualizado
 */
exports.updateDetalleOrden = async (req, res) => {
    // #swagger.tags = ['Ordenes']
    const id = parseInt(req.params.id, 10);
    const { cantidad, ajustePreciosIds } = req.body;

    try {
        // Obtener el detalle de orden existente
        const detalleExistente = await sql.selectDetalleOrdenById(id);
        if (!detalleExistente) {
            return res.status(404).json({ msg: 'Detalle de orden no encontrado' });
        }

        const updatedDetalle = {
            cantidad: cantidad || detalleExistente.cantidad,
            impuesto_aplicado: detalleExistente.impuesto_aplicado,
            descuento_aplicado: detalleExistente.descuento_aplicado,
            subtotal: detalleExistente.subtotal,
        };

        // Si se proporciona una nueva cantidad, recalcular el subtotal
        if (cantidad) {
            const item = await sqlItem.selectItemById(detalleExistente.item_id);

            if (item.tipo === 'PRODUCTO') {
                const producto = await sqlProducto.selectProducto_ByItemId(detalleExistente.item_id);

                if (producto[0].stock < cantidad) {
                    updatedDetalle.cantidad = detalleExistente.cantidad;
                    console.log('No hay suficiente stock para el producto:', producto[0].nombre);

                } else {
                    updatedDetalle.subtotal = producto[0].precio * cantidad;

                    // Actualizar el stock del producto
                    const nuevoStock = producto[0].stock - (cantidad - detalleExistente.cantidad);
                    await sqlProducto.updateStock(detalleExistente.item_id, nuevoStock);
                }

            }

            if (item.tipo === 'SERVICIO') {
                const servicio = await sqlServicio.selectServicio_ByItemId(detalleExistente.item_id);
                updatedDetalle.subtotal = servicio[0].precio * cantidad;
            }
        }

        // Si se proporcionan nuevos ajustes de precio, recalcular impuestos y descuentos
        if (ajustePreciosIds && ajustePreciosIds.length > 0) {
            updatedDetalle.impuesto_aplicado = 0;
            updatedDetalle.descuento_aplicado = 0;

            ajustePreciosIds.forEach(async (ajusteId) => {
                const ajuste = await sqlAjustePrecio.selectAjustePrecioById(ajusteId);
                if (ajuste.tipo === 'IMPUESTO') {
                    updatedDetalle.impuesto_aplicado += parseFloat(ajuste.valor);
                }
                if (ajuste.tipo === 'DESCUENTO') {
                    updatedDetalle.descuento_aplicado += parseFloat(ajuste.valor);
                }
            });
        }

        // Actualizar el detalle de orden en la base de datos
        const result = await sql.updateDetalleOrden(id, updatedDetalle);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// Elimina un detalle de una orden existente
/** DELETE /api/ordenes/detalle/:id
 * @param {number} id Id del detalle a aeliminar 
 * @returns El detalle eliminado 
 */
exports.deleteDetalleOrden = async (req, res) => {
    // #swagger.tags = ['Ordenes']
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteDetalleOrden(id);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// Actualiza una orden existente, sin items
/** PUT /api/ordenes/:id
 * @param {number} id Id de la orden a actualizar 
 * @param {{cliente_id:number, fecha:Date, estado:string}} req
 * @returns La orden actualizada
 */
exports.updateOrden = async (req, res) => {
    // #swagger.tags = ['Ordenes']
    const id = parseInt(req.params.id, 10);
    const { cliente_id, fecha, estado } = req.body;
    const orden = { id, cliente_id, fecha, estado };

    try {
        console.log('Datos de la orden: ' + orden);
        const result = await sqlOrden.updateOrden(orden);
        if (!result) {
            return res.status(404).json({ msg: 'Orden no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// Elimina una orden existente, sin items
/** DELETE /api/ordenes/:id
 * @param {number} id Id de a orden a eliminar 
 * @returns La orden eliminada
 */
exports.deleteOrden = async (req, res) => {
    // #swagger.tags = ['Ordenes']
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sqlOrden.deleteOrden(id);
        if (!result) {
            return res.status(404).json({ msg: 'Orden no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};
