const express = require('express');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(express.json());

app.get('/', async (req, res) => {
    console.log('Recibiendo solicitud en la ruta raíz');
    res.send('<h1>Servidor de Autenticación</h1>');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});