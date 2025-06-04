const sql = require('../models/modelsCliente');

const validarCliente = async cli => {
    const errors = {};

    // Validamos el dni
    if (isNaN(cli.dni) || cli.dni <= 0) {
        errors.dni = 'DNI invalido';
    }
    // Validamos la razon social
    if (cli.razon_social.length < 3) {
        errors.razon_social = 'Razon social invalida';
    }
    // Validamos el correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cli.correo)) {
        errors.correo = 'Correo invalido';
    }
    // Validamos el telefono
    if (cli.telefono && !/^(0414|0424|0416|0426|0412)\d{7}$/.test(cli.telefono)) {
        errors.telefono = 'Telefono invalido';
    }
    // Validamos la direccion
    if (cli.direccion && cli.direccion.length < 5) {
        errors.direccion = 'Direccion invalida';
    }
    // Si hay errores, los enviamos como respuesta
    if (Object.keys(errors).length > 0) {
        return errors;
    } else {
        return true;
    }
}

// GET /api/cliente
exports.getAllCliente = async (req, res) => {
    // #swagger.tags = ['Cliente']
    try {
        console.log('Iniciando consulta...');
        const result = await sql.selectAllCliente();
        console.log('Resultados Obtenidos:', result);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// GET /api/cliente/:id
exports.getClienteById = async (req, res) => {
    // #swagger.tags = ['Cliente']
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectClienteById(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/** POST /api/clientes 
 * @param {{dni:number, razon_social:string, correo:email, telefono:string, direccion:string}} req 
 * @param {*} res 
 * @returns 
 */
exports.createCliente = async (req, res) => {
    // #swagger.tags = ['Cliente']
    const newCliente = {
        dni : parseInt(req.body.dni) || 0,
        razon_social : req.body.razon_social || '',
        correo : req.body.correo || '',
        telefono : req.body.telefono || null,
        direccion : req.body.direccion || null,
    }

    console.log('Datos recibidos:', newCliente);
    // Validamos que el dni no exista en la base de datos
    const clienteExistente = await sql.selectCliente_ByDni(newCliente.dni);
    
    if (clienteExistente.length > 0) {
        return res.status(409).json({ msg: 'El cliente ya existe' });
    }

    // Validamos el cliente
    const validacion = await validarCliente(newCliente);
    if (validacion !== true) {
        return res.status(400).json({ validacion});
    }

    try {
        const result = await sql.insertCliente(newCliente);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// PUT /api/cliente:id
exports.updateCliente = async (req, res) => {
    // #swagger.tags = ['Cliente']
    const id = parseInt(req.params.id);

    const cliente = await sql.selectClienteById(id);
    if(cliente.length === 0){
        console.log('Cliente no Encontrado');
        return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    const updateCliente = {
        id : id,
        dni : cliente[0].dni,
        razon_social : req.body.razon_social || cliente[0].razon_social,
        correo : req.body.correo || cliente[0].correo,
        telefono : req.body.telefono || cliente[0].telefono,
        direccion : req.body.direccion || cliente[0].direccion,
        estado : cliente[0].estado
    }

    console.log('Datos recibidos:', updateCliente);

    // Validamos el cliente
    const validacion = await validarCliente(updateCliente);
    if (validacion !== true) {
        return res.status(400).json(validacion);
    }

    try {
        const result = await sql.updateCliente(updateCliente);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// DELETE /api/cliente:id
exports.deleteCliente = async (req, res) => {
    // #swagger.tags = ['Cliente']
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteCliente(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/**
 * Validar cliente
 * @param {int} cli
 * @returns 
 */

exports.validateCliente = async (cli) => {
    cli = parseInt(cli, 10);
    let e = {}

    // Validamos formato de cliente_id
    if (isNaN(cli) || cli <= 0) {
        e.cli = 'Cliente invalido'
    } else if (await sql.selectClienteById(cli).length === 0) {
        e.cli = 'Cliente no existe'
    }

    // Verificamos que no hayan errores
    if (Object.keys(e).length > 0) {
        return e;
    } else {
        return true;
    }
}
