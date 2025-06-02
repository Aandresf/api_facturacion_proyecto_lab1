-- Vista para detalles de órdenes con información del cliente y nombres de ítems
CREATE VIEW vista_detalles_orden_cliente_item AS
SELECT
    det_ord.ID AS detalle_orden_id,
    o.ID AS orden_id,
    c.ID AS cliente_id,
    c.DNI AS cliente_dni,
    c.RAZON_SOCIAL AS cliente_razon_social,
    o.FECHA AS fecha_orden,
    i.ID AS item_id,
    i.NOMBRE AS nombre_item,
    i.TIPO AS tipo_item,
    det_ord.CANTIDAD AS cantidad,
    det_ord.SUBTOTAL AS subtotal,
    det_ord.IMPUESTO_APLICADO AS impuesto_aplicado,
    det_ord.DESCUENTO_APLICADO AS descuento_aplicado
FROM
    DETALLES_ORDEN det_ord
JOIN
    ORDEN o ON det_ord.ORDEN_ID = o.ID
JOIN
    CLIENTE c ON o.CLIENTE_ID = c.ID
JOIN
    ITEM i ON det_ord.ITEM_ID = i.ID;

-- Vista para detalles de órdenes con nombres de productos
CREATE VIEW vista_detalles_orden_productos AS
SELECT
    vdo.detalle_orden_id,
    vdo.orden_id,
    vdo.cliente_id,
    vdo.cliente_dni,
    vdo.cliente_razon_social,
    vdo.fecha_orden,
    vdo.item_id,
    vdo.nombre_item AS nombre_producto,
    vdo.cantidad,
    vdo.subtotal,
    vdo.impuesto_aplicado,
    vdo.descuento_aplicado,
    p.STOCK AS stock_producto,
    p.PRECIO AS precio_producto,
    p.COSTE AS coste_producto
FROM
    vista_detalles_orden_cliente_item vdo
JOIN
    PRODUCTOS p ON vdo.item_id = p.ITEM_ID
WHERE
    vdo.tipo_item = 'PRODUCTO';

-- Vista para detalles de órdenes con nombres de servicios
CREATE VIEW vista_detalles_orden_servicios AS
SELECT
    vdo.detalle_orden_id,
    vdo.orden_id,
    vdo.cliente_id,
    vdo.cliente_dni,
    vdo.cliente_razon_social,
    vdo.fecha_orden,
    vdo.item_id,
    vdo.nombre_item AS nombre_servicio,
    vdo.cantidad,
    vdo.subtotal,
    vdo.impuesto_aplicado,
    vdo.descuento_aplicado,
    s.PRECIO AS precio_servicio
FROM
    vista_detalles_orden_cliente_item vdo
JOIN
    SERVICIO s ON vdo.item_id = s.ITEM_ID
WHERE
    vdo.tipo_item = 'SERVICIO';

-- Vista para obtener la información de los productos con su categoría
CREATE VIEW vista_productos_con_categoria AS
SELECT
    p.ID AS producto_id,
    i.ID AS item_id,
    i.NOMBRE AS item_nombre,
    i.DESCRIPCION AS item_descripcion,
    c.ID AS categoria_id,
    c.DESCRIPCION AS categoria_descripcion,
    c.TIPO AS categoria_tipo,
    c.ESTADO AS categoria_estado,
    i.TIPO AS item_tipo,
    i.ESTADO AS item_estado,
    p.STOCK AS producto_stock,
    p.PRECIO AS producto_precio,
    p.COSTE AS producto_coste
FROM
    PRODUCTOS p
JOIN
    ITEM i ON p.ITEM_ID = i.ID
JOIN
    CATEGORIA c ON i.CATEGORIA_ID = c.ID;

-- Vista para obtener la información de los servicios con su categoría
CREATE VIEW vista_servicios_con_categoria AS
SELECT
    s.ID AS servicio_id,
    i.ID AS item_id,
    i.NOMBRE AS item_nombre,
    i.DESCRIPCION AS item_descripcion,
    c.ID AS categoria_id,
    c.DESCRIPCION AS categoria_descripcion,
    c.TIPO AS categoria_tipo,
    c.ESTADO AS categoria_estado,
    i.TIPO AS item_tipo,
    i.ESTADO AS item_estado,
    s.PRECIO AS servicio_precio
FROM
    SERVICIO s
JOIN
    ITEM i ON s.ITEM_ID = i.ID
JOIN
    CATEGORIA c ON i.CATEGORIA_ID = c.ID;

