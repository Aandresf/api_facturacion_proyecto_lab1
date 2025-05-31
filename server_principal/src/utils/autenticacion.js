
import jwt from 'jsonwebtoken';

// Middleware para verificar el token
export function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expirado' });
            }
            return res.status(403).json({ message: 'Token inválido' });
        }else {
            console.log('Token verificado correctamente');
            req.usuario = decoded.data; // Almacena los datos del usuario en la solicitud
            next();
        }
    });
}


/**
 * verifica elroldel usuario autenticado
 * @param {string} rol - El rol que se desea verificar
 */
export function verificarRol(rol) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(403).json({ mensaje: 'Autenticacion incorrecta.' });
        }

        const rolesUsuario = req.usuario.permisos || []; // Obtiene los roles del usuario del token

        if(rolesUsuario.includes(rol)) {
            console.log('Permiso de ' + rol + ' concedido');
            next();
        }else {
            return res.status(403).json({ message: 'Permiso denegado' });
        }
    };
}