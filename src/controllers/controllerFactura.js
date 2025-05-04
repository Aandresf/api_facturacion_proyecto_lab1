const sql = require('../models/modelsFactura');
const sqlOrden = require('../models/modelsOrden');
const sqlCliente = require('../models/modelsCliente');
const sqlCorreo = require('../models/modelsCorreo');
const sgMail = require('@sendgrid/mail');
const msgCorreo = require('../utils/formatoFactura');

// Configurar SendGrid con la API Key desde las variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GET /api/facturas
exports.getAllFacturas = async (req, res) => {
    try {
        const result = await sql.selectAllFacturas();
        result.forEach(factura => {
            factura.fecha = new Date(factura.fecha).toISOString().split('T')[0]; // Formatear fecha
        });
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// GET /api/facturas/:id
exports.getFacturaById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectFacturaById(id);
        if (!result) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }
        result.fecha = new Date(result.fecha).toISOString().split('T')[0]; // Formatear fecha
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/facturas
exports.createFactura = async (req, res) => {
    const { orden_id, serie, numero, fecha } = req.body;
    if (!orden_id || !serie || !numero) {
        return res.status(400).json({ msg: 'orden_id, serie, numero son necesarios' });
    }
    const factura = { orden_id, serie, numero, fecha: new Date(), estado: 'ACTIVO' };

    try {
        const result = await sql.insertFactura(factura);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// PUT /api/facturas/:id
exports.updateFactura = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { orden_id, serie, numero, fecha, estado } = req.body;
    const factura = { id, orden_id, serie, numero, fecha, estado };

    try {
        const result = await sql.updateFactura(factura);
        if (!result) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// DELETE /api/facturas/:id
exports.deleteFactura = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteFactura(id);
        if (!result) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/facturas/send/:id
exports.sendFacturaById = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        // Obtener la factura por ID
        const factura = await sql.selectFacturaById(id);
        if (!factura) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }

        //Obtener la orden asociada a la factura
        const orden = await sqlOrden.selectOrdenById(factura.orden_id);
        if (!orden) {
            return res.status(404).json({ msg: 'Orden no encontrada' });
        }

        // Obtener el cliente asociado a la factura
        const cliente = await sqlCliente.selectClienteById(orden.cliente_id);
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        // Obtener los correos del cliente
        const correos = await sqlCorreo.selectCorreoByClienteId(cliente[0].id);
        if (!correos || correos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron correos para el cliente' });
        }
        correos.forEach(correo => {
            correo.email = correo.descripcion + '@' + correo.dominio; // Crear el email completo
        });

        // Obtener el detalle de la orden
        const detalleOrden = await sqlOrden.selectDetallesOrdenById(orden.id);
        detalleOrden.map(detalle => (
            detalle.cantidad = parseInt(detalle.cantidad),
            detalle.subtotal = parseFloat(detalle.subtotal),
            detalle.impuestoPorcetanje = detalle.impuesto,
            detalle.impuesto = (parseFloat(detalle.impuesto)/100),
            detalle.descuentoPorcetanje = detalle.descuento,
            detalle.descuento = (parseFloat(detalle.descuento)/100),

            detalle.precioUnitario= detalle.subtotal/detalle.cantidad,
            detalle.impuesto = detalle.precioUnitario * detalle.impuesto,
            detalle.descuento = (detalle.precioUnitario + detalle.impuesto) * detalle.descuento,
            detalle.subtotal = (detalle.precioUnitario + detalle.impuesto - detalle.descuento)* detalle.cantidad
            ));
        
        //objeto con los datos de la factura
        const datosFactura = {
            serie: factura.serie,
            numero: factura.numero,
            fecha: factura.fecha,
            orden_id: factura.orden_id,
            cliente_id: cliente[0].id,
            cliente_nombre: cliente[0].razon_social,
            cliente_direccion: cliente[0].direccion,
            cliente_telefono: cliente[0].telefono,
            cliente_correo: correos.map(correo => correo.email),//.join(', '),
            orden_fecha: orden.fecha,
            orden_total: orden.total,
            orden_estado: orden.estado,
            orden_detalle: detalleOrden.map(detalle => ({
                item: detalle.Item,
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario.toFixed(2),
                impuesto: detalle.impuestoPorcetanje,
                descuento: detalle.descuentoPorcetanje,
                subtotal: detalle.subtotal.toFixed(2),
            })),
            orden_subtotal: 0,
            orden_impuesto: 0,
            orden_descuento: 0,
            orden_total: 0,
        };

        for (detalle of detalleOrden) {
            datosFactura.orden_subtotal += detalle.precioUnitario * detalle.cantidad;
            datosFactura.orden_impuesto += detalle.impuesto;
            datosFactura.orden_descuento += detalle.descuento;
        }
        datosFactura.orden_total = datosFactura.orden_subtotal + datosFactura.orden_impuesto - datosFactura.orden_descuento;

        // Enviar el correo
        const msg = msgCorreo.mailOptions(datosFactura);
        res.send(msg.html)
        /*
        await sgMail.send(msg);

        res.json({ 
                msg: `Factura ${factura.serie}-${factura.numero} enviada correctamente`, 
                correos: correos.map(correo => correo.email) 
            });
        */    
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al enviar la factura', error: error.message });
    }
};