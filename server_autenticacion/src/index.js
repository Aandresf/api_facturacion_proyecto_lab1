const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    console.log('Recibiendo solicitud en la ruta raíz');
    res.send('<h1>Servidor de Autenticación</h1>');
});

app.post('/login', async (req, res) => {
    const data = {
        user: 'Arnaldo',
        password: 'password123',
        permisos: ['lectura','escritura']
        //permisos: ['escritura']
    }

        const token = jwt.sign({ data }, 'secretKey', { expiresIn: '1h' });

        res.json({ token });
});

app.get('/protected', verifyToken, (req, res) => {
    console.log('Bienvenido ' + req.user);
    //console.log('Usuario autenticado:', req.user);
    res.send('<h1>Ruta protegida</h1><p>Acceso permitido solo con token válido.</p>');
});

// Middleware para verificar el token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        if(decoded.data.permisos.includes('lectura')) {
            console.log('Permiso de lectura concedido');
            req.user = decoded.data.user;
            next();
        }else {
            return res.status(403).json({ message: 'Permiso denegado' });
        }
    });
}




const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});