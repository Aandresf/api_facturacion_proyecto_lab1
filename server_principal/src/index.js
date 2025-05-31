const express = require('express');
const db = require('./utils/db.js');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.json');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(express.json());



app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//console.log('configuracion swagger:', swaggerSpec);

// Routes
const routes = require('./routes/allRoutes.js');
const routesOrdenes = require('./routes/routesOrdenes.js');
const routesProductos = require('./routes/routesProducts.js');
const routesFacturas = require('./routes/routesFacturas.js');
const routesCliente = require('./routes/routesCliente.js');
const routesCategorias = require('./routes/routesCategorias.js');
const routesAjustePrecio = require('./routes/routesAjustePrecios.js');

//app.use('/api/items', routes.items);
app.use('/api', routesCategorias);
app.use('/api', routesAjustePrecio);

app.use('/api', routesCliente);
app.use('/api', routesFacturas);
app.use('/api', routesProductos);
app.use('/api', routesOrdenes);

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

// Endpoint de prueba
const routesTest = require('./routes/test.js');
app.use('/api', routesTest)


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Documentación de la API disponible en http://localhost:${PORT}/docs`);
});
