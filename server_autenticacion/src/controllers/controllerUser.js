require('dotenv').config({ path: './.env' });
const sql = require('../models/modelsUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validarUsuario = async user => {
    const errors = {};

    // Validamos la razon social
    if (user.usuario != null && user.usuario.length < 5) {
        errors.usuario = 'Usuario demasiado corto, minimo 3 caracteres';
    }
    // Validamos el password
    if (user.password != null && user.password.length < 6) {
        errors.password = 'Password demasiado corto, minimo 6 caracteres';
    }

    // Validamos la rol
    if (user.rol != null && !['Auditor', 'Caja', 'Admin', 'SuperAdmin'].includes(user.rol)) {
        errors.rol = 'Rol invalido, debe ser Auditor, Caja, Admin o SuperAdmin';
    }

    // Si hay errores, los enviamos como respuesta
    if (Object.keys(errors).length > 0) {
        return errors;
    } else {
        return true;
    }
}

// GET /api/usuarios
exports.getAllUsers = async (req, res) => {
    // #swagger.tags = ['Usuarios']
    try {
        const result = await sql.selectAllUsers();
        console.log('Resultados Obtenidos:', result);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// GET /api/usuarios/:rol
exports.getUserbyRol = async (req, res) => {
    // #swagger.tags = ['Usuarios']
    const rol = req.params.rol;
    try {
        const result = await sql.selectUsers_byRol(rol);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/** POST /api/usuarios 
 * @param {{usuario:string, password:string, rol:string}} req 
 * @param {*} res 
 * @returns 
 */
exports.createUser = async (req, res) => {
    // #swagger.tags = ['usuarios']
    const newUser = {
        usuario : req.body.usuario || null,
        password : req.body.password || null,
        rol : req.body.rol || null,
    }

    console.log('Datos recibidos:', newUser);

    // Validamos el usuario
    const validacion = await validarUsuario(newUser);
    if (validacion !== true) {
        return res.status(400).json({ validacion});
    }

    try {
        // Encriptamos el password
        console.log('Encriptando password...'+ newUser.password + ' con saltRounds: ' + process.env.AUTH_BCRYPT_SALT_ROUNDS);
        const saltRounds = parseInt(process.env.AUTH_BCRYPT_SALT_ROUNDS, 10) || 10;
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);

        const result = await sql.insertUser(newUser);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// PUT /api/usuarios:id
exports.updateUsuarios = async (req, res) => {
    // #swagger.tags = ['usuarios']
    const id = parseInt(req.params.id);

    const updateUser = {
        id : id,
        userName : req.body.usuario || null,
        password : req.body.password || null,
        rol : req.body.rol || null
    }

    console.log('Datos recibidos:', updateUser);

    // Validamos el usuario
    const validacion = await validarUsuario(updateUser);
    if (validacion !== true) {
        return res.status(400).json(validacion);
    }

    try {
        // Encriptamos el password
        if (updateUser.password !== null) {
            const saltRounds = parseInt(process.env.AUTH_BCRYPT_SALT_ROUNDS, 10) || 10;
            updateUser.password = await bcrypt.hash(updateUser.password, saltRounds);
        }

        console.log('Datos a actualizar:', updateUser);
        
        const result = await sql.updateUser(updateUser);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// DELETE /api/usuarios:id
exports.deleteUsers = async (req, res) => {
    // #swagger.tags = ['Usuarios']
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteUser(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/**
 * Logear Usuario
 * @param {{usuario:string, password:string}} req
 * @returns 
 */
exports.loginUser = async (req, res) => {
    const user = req.body
    try {

        const userCredentials = await sql.validateUser(user.usuario);
        console.log('Credenciales del usuario:', userCredentials);

        if (!userCredentials.is_active_out) {
            console.log(`Intento de login fallido: Usuario "${user.usuario}" está inactivo.`);
            return
        }

        const passwordMatch = await bcrypt.compare(user.password, userCredentials.password_hash_out);

        if (!passwordMatch) {
            console.log(`Intento de login fallido: Contraseña incorrecta para "${user.usuario}".`);
            return
        }

        const userDetails = await sql.selectUser_byId(userCredentials.user_id_out);

        console.log(`Login exitoso para el usuario "${userDetails.username}" con rol "${userDetails.user_role}".`);
        
        // Generar token JWT
        const token = jwt.sign({userDetails}, process.env.AUTH_JWT_SECRET_KEY, { expiresIn: '1h' });
        return res.json({
            message: 'Login exitoso',
            token: token
        });

    } catch (error) {
        console.error('Error al verificar credenciales:', error.message);
    }
};
