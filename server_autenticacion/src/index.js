require('dotenv').config({ path: './.env' });
const bc = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./utils/db.js');
const controllerUser = require('./controllers/controllerUser.js');

const app = express();
const PORT = process.env.AUTH_SERVER_PORT || 5000;

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        db.getNow().then((now) => {
            res.send('<h1>Api de Autenticacion</h1> <br> ' + 
                        'Fecha y hora actual: ' + now);
            console.log('Autenticacio - Fecha y hora actual:', now);
        });
    } catch (error) {
        console.error(error.message);
    }
});

app.post('/login', controllerUser.loginUser);

app.get('/usuarios', controllerUser.getAllUsers);
app.post('/usuarios', controllerUser.createUser);
app.put('/usuarios/:id', controllerUser.updateUsuarios);
app.delete('/usuarios/:id', controllerUser.deleteUsers);


app.get('/password', async (req, res) => {
    const password = '1234';
    const saltRounds = process.env.AUTH_SALT_ROUNDS || 10;
    const passwordHash = await bc.hash(password, saltRounds);
    res.json({ password, passwordHash });
    //$2b$10$mRbwwHDhiWeYmeDrj1cOgeS6OCWNt1QXfxKGsn6ohgiawn4sQV9Oy
});





app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});