const express = require('express');
const db = require('./utils/db.js');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(express.json());

// Routes
const routes = require('./routes/allRoutes.js');

app.use('/api/categorias', routes.categorias);
app.use('/api/ajusteprecio', routes.ajusteprecio);
app.use('/api/items', routes.items);
app.use('/api/cliente', routes.cliente);
app.use('/api/direccion', routes.direccion);
app.use('/api/clienteDireccion', routes.clienteDireccion);
app.use('/api/telefono', routes.telefono);
app.use('/api/Correo', routes.correo);

app.use('/api/facturas', routes.facturas);
app.use('/api/products', routes.productos);
app.use('/api/ordenes', routes.ordenes);

app.get('/', async (req, res) => {
    try {
        db.getNow().then((now) => {
            res.send('<h1>Api de Facturacion</h1> <br> ' + 
                        'Fecha y hora actual: ' + now);
            console.log('Fecha y hora actual:', now);
        });
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});