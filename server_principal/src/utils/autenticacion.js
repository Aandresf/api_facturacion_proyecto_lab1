require('dotenv').config({ path: './.env' });
import jwt from 'jsonwebtoken';

// Middleware para verificar el token
export function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expirado' });
            }
            return res.status(403).json({ message: 'Token inválido' });
        }else {
            console.log('Token verificado correctamente');
            req.usuario = decoded.userDetails; // Almacena los datos del usuario en la solicitud
            next();
        }
    });
}


/**
 * verifica elroldel usuario autenticado
 * @param {string} rol - El rol que se desea verificar
 */
export function verificarRol(permiso) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(403).json({ mensaje: 'Autenticacion incorrecta.' });
        }

        const permisosUsuario = req.usuario.permissions || []; // Obtiene los roles del usuario del token

        if(permisosUsuario.includes(permiso)) {
            console.log('Login con rol ' + req.usuario.user_role);
            console.log('Bienvenido ' + req.usuario.username);
            console.log('Permiso de ' + permiso + ' concedido');
            next();
        }else {
            return res.status(403).json({ message: 'Permiso denegado' });
        }
    };
}