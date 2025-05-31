/*
const datosFactura = {
    serie: factura.serie,
    numero: factura.numero,
    fecha: factura.fecha,
    cliente_id: cliente[0].id,
    cliente_nombre: cliente[0].razon_social,
    cliente_direccion: cliente[0].direccion,
    cliente_telefono: cliente[0].telefono,
    cliente_correo: correos.map(correo => correo.email),
    orden_id: factura.orden_id,    
    orden_fecha: orden.fecha,
    orden_total: orden.total,
    orden_estado: orden.estado,
    orden_detalle: detalleOrden.map(detalle => ({
        item: detalle.item,
        cantidad: detalle.cantidad,
        subtotal: detalle.subtotal,
        impuesto: detalle.impuesto,
        descuento: detalle.descuento,
    })),
    orden_subtotal: subtotal,
    orden_impuesto: impuesto,
    orden_descuento: descuento,
    orden_total: total,
};
*/
function formatearFecha(f) {
    const fecha = new Date(f);
    const opciones = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return fecha.toLocaleDateString(undefined, opciones);
}

export const mailOptions = datosFactura => {
    return {
    to: datosFactura.cliente_correo,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Recibo de la compra del ${formatearFecha(datosFactura.orden_fecha)}`,
    text: `Gracias por su compra, número de orden ${datosFactura.orden_id}.`,
    html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: sans-serif;
                }
                .invoice {
                    width: 100%;
                    max-width: 800px;
                    margin-top: 20px;
                }
                .invoice th, .invoice td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .invoice th {
                    background-color: #f2f2f2;
                }
                .total-row td {
                    font-weight: bold;
                }
                .invoice-footer tr td {
                    border: none;
                }
                .invoice-footer tr th {
                    border: none;
                }
            </style>
        </head>
        <body>
        <h1>Gracias por su compra</h1>
            <p>Estimado <strong>${datosFactura.cliente_nombre}</strong>,</p>
            <p>Adjuntamos a este correo su factura <strong>${datosFactura.serie} - ${datosFactura.numero}</strong> del <strong>${formatearFecha(datosFactura.fecha)}</strong></p>

            <h3>Detalle de su compra:</h3>
            <table class="invoice">
                <thead>
                    <tr>
                        <th>Artículo</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Impuesto</th>
                        <th>Descuento</th>
                        <th>Total Unitario</th>
                    </tr>
                </thead>
                <tbody>
                    ${datosFactura.orden_detalle.map(detalle => `
                        <tr>
                            <td>${detalle.item}</td>
                            <td>${detalle.cantidad}</td>
                            <td>USD ${detalle.precioUnitario}</td>
                            <td>% ${detalle.impuesto}</td>
                            <td>% ${detalle.descuento}</td>
                            <td>USD ${detalle.subtotal}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot class="invoice-footer">
                    <tr>
                        <td colspan="4"></td>
                        <td class="total-row">Subtotal:</td>
                        <td class="total-row">USD ${datosFactura.orden_subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4"></td>
                        <td class="total-row">Impuesto Total:</td>
                        <td class="total-row">USD ${datosFactura.orden_impuesto.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4"></td>
                        <td class="total-row">Descuento Total:</td>
                        <td class="total-row">USD ${datosFactura.orden_descuento.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4"></td>
                        <td class="total-row">Total:</td>
                        <td class="total-row"><strong>USD ${datosFactura.orden_total.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
            <hr>
            <p>Gracias nuevamente por su compra.</p>
        </body>
        </html>
    `,
}};