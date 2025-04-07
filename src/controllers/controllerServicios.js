const sqlItems = require('../models/modelsItem');
const sqlServicios = require('../models/modelsServicio');
const controllerCat = require('../controllers/controllerCategorias');
const controllerAjustes = require('../controllers/controllerAjustePrecio');

/** Busca un servicio por su id
 * @param {number} serviceId
 * @returns {} Un servicio por su id
 * @description Busca un servicio por su id y lo devuelve con los detalles de su item
 */
async function getService_Logica(serviceId) {
    try {
        const service = await sqlServicios.selectServicio_ById_joinItems(serviceId);
        if (service?.length > 0) {
            service[0].ajustesPrecio = await controllerAjustes.getAjustesByItem(service[0].item_id);
        }
        return service[0];
    } catch (error) {
        console.error(error.message);
    }
}

/** GET /api/services
 * @returns Todos los servicios
 * @descripcion Busca todos los servicios
 */
exports.getAllServices = async (req, res) => {
    try {
        const result = await sqlServicios.selectAllServicios_joinItems();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
};

/** GET /api/services/:id
 * @param {number} id
 * @returns Un servicio por su id
 * @descripcion Busca un servicio por su id
 */
exports.getServiceById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await getService_Logica(id);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
};

/** POST /api/services/new
 * @param {{item:{nombre:string, descripcion:string, categoria_id:number}, idsAjustesPrecios:number[], precio:number}} req
 * @returns Servicio creado
 * @descripcion Crea un servicio
 */
exports.createService = async (req, res) => {
    let { item, idsAjustesPrecios, precio } = req.body;

    try {
        // Arreglo para manejar posibles errores de validación de datos
        let errores = [];

        // Validamos formato del item
        if (!item.nombre || !item.descripcion || !item.categoria_id) {
            errores.push({ msg: 'item:{nombre, descripcion, categoria_id} es necesario' });
        }

        // Validamos la categoría
        const c = await controllerCat.validateCategoria(item.categoria_id);
        if (c !== true) {
            errores.push(c);
        }

        // Validar formato del precio
        if (!precio || isNaN(precio) || precio < 0) {
            errores.push({ msg: 'Precio debe ser un número válido' });
        }

        // Validar los ajustes de precios
        const ajustes = await controllerAjustes.validarAjustesPrecio(idsAjustesPrecios);
        if (ajustes !== true) {
            errores.push(ajustes);
        }

        // Si hay errores, se envían
        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        let result = {};

        // Creamos el item
        const i = {
            nombre: item.nombre,
            descripcion: item.descripcion,
            categoria_id: parseInt(item.categoria_id, 10),
            tipo: 'SERVICIO'
        };

        const newItem = await sqlItems.insertItem(i);
        result.item = newItem[0];

        // Creamos los ajustes de precio
        const ajust = await controllerAjustes.newAjustesPrecioForItem(idsAjustesPrecios, newItem[0].id);
        result.ajustesPrecio = ajust;

        // Creamos el servicio
        const s = {
            item_id: parseInt(newItem[0].id, 10),
            precio: parseFloat(precio)
        };
        const newServicio = await sqlServicios.insertServicio(s);
        result.servicio = newServicio[0];

        return res.json(result);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ "Error": error.message, msg: 'Error al realizar la operacion' });
    }
};

/** PUT /api/services/:id
 * @param {nombre:string, descripcion:string, categoria_id:number, idsAjustesPrecios:number[], precio:number} req
 * @returns Servicio modificado
 * @descripcion Modifica un servicio
 */
exports.updateService = async (req, res) => {
    const idService = parseInt(req.params.id, 10);
    const oldService = await getService_Logica(idService);

    let { nombre, descripcion, categoria_id, idsAjustesPrecios, precio } = req.body;

    try {
        // Arreglo para manejar posibles errores de validación de datos
        let errores = [];

        // Validamos formato del item
        if (!nombre) {
            errores.push({ msg: 'El nombre es obligatorio' });
        }

        if (!descripcion) {
            errores.push({ msg: 'La descripcion es obligatoria' });
        }

        // Validamos la categoría
        if (categoria_id) {
            const c = await controllerCat.validateCategoria(categoria_id);
            if (c !== true) {
                errores.push(c);
            }
        }

        // Validar formato del precio
        if (precio !== undefined && (isNaN(precio) || precio < 0)) {
            errores.push({ msg: 'Precio debe ser un número válido' });
        }

        // Validar los ajustes de precios
        const ajustes = await controllerAjustes.validarAjustesPrecio(idsAjustesPrecios);
        if (ajustes !== true) {
            errores.push(ajustes);
        }

        // Si hay errores, se envían
        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        let result = {};

        // Actualizamos el item
        const i = {
            id: oldService.item_id,
            nombre: nombre || oldService.nombre,
            descripcion: descripcion || oldService.descripcion,
            categoria_id: categoria_id || oldService.categoria_id,
            tipo: 'SERVICIO'
        };

        const updatedItem = await sqlItems.updateItem(i);
        result.item = updatedItem[0];

        // Actualizamos los ajustes de precio
        if (idsAjustesPrecios) {
            const ajust = await controllerAjustes.newAjustesPrecioForItem(idsAjustesPrecios, oldService.item_id);
            result.ajustesPrecio = ajust;
        }

        // Actualizamos el servicio
        const s = {
            id: idService,
            precio: precio !== undefined ? parseFloat(precio) : oldService.precio
        };
        const updatedServicio = await sqlServicios.updateServicio(s);
        result.servicio = updatedServicio[0];

        return res.json(result);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ "Error": error.message, msg: 'Error al realizar la operacion' });
    }
};

/** DELETE /api/services/:id
 * @param {number} id
 * @returns Servicio eliminado
 * @descripcion Elimina un servicio
 */
exports.deleteService = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sqlServicios.deleteServicio(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
};