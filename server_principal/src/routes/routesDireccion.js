const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerDireccion'); 

// Obtener todas las direcciones
router.get('/', controller.getAllDirecciones);

// Obtener una dirección por ID
router.get('/:id', controller.getDireccionById);

// Obtener direcciones de un cliente específico
router.get('/cliente/:clienteId', controller.getDireccionesByClienteId);

// Crear una nueva dirección
router.post('/', controller.createDireccion);

// Actualizar una dirección existente
router.put('/:id', controller.updateDireccion);

// Eliminar una dirección
router.delete('/:id', controller.deleteDireccion);

// Crear una dirección para un cliente específico
router.post('/:clienteId', controller.createDireccionForCliente);

module.exports = router;