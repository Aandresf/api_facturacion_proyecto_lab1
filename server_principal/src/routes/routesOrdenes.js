const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerOrden');
const {verifyToken, verificarRol} = require('../utils/autenticacion');

router.get('/ordenes', verifyToken, verificarRol('Lectura'), controller.getAllOrden);

router.get('/ordenes/:ordenId', verifyToken, verificarRol('Lectura'), controller.getOrdenById);

// POST /api/ordenes
router.post('/ordenes', verifyToken, verificarRol('Escritura'), controller.createOrden);

// POST /api/ordenes/:ordenId/detalle
router.post('/ordenes/:ordenId/detalle', verifyToken, verificarRol('Escritura'), controller.createDetalleOrden);

// PUT /api/ordenes/:id
router.put('/ordenes/:ordenId', verifyToken, verificarRol('Actualizacion'), controller.updateOrden);

// PUT /api/ordenes/detalle/:id
router.put('/ordenes/detalle/:detalleId', verifyToken, verificarRol('Actualizacion'), controller.updateDetalleOrden);

// DELETE /api/ordenes/:id
router.delete('/ordenes/:ordenId', verifyToken, verificarRol('Eliminacion'), controller.deleteOrden);

// DELETE /api/ordenes/detalle/:id
router.delete('/ordenes/detalle/:detalleId', verifyToken, verificarRol('Eliminacion'), controller.deleteDetalleOrden);

module.exports = router;