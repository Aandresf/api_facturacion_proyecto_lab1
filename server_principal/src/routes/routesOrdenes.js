const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerOrden');
const {verifyToken, verificarRol} = require('../utils/autenticacion');

router.get('/ordenes', verifyToken, verificarRol('lectura') , controller.getAllOrden);

router.get('/ordenes/:ordenId', controller.getOrdenById);

// POST /api/ordenes
router.post('/ordenes', controller.createOrden);

// POST /api/ordenes/:ordenId/detalle
router.post('/ordenes/:ordenId/detalle', controller.createDetalleOrden);

// PUT /api/ordenes/:id
router.put('/ordenes/:ordenId', controller.updateOrden);

// PUT /api/ordenes/detalle/:id
router.put('/ordenes/detalle/:detalleId', controller.updateDetalleOrden);

// DELETE /api/ordenes/:id
router.delete('/ordenes/:ordenId', controller.deleteOrden);

// DELETE /api/ordenes/detalle/:id
router.delete('/ordenes/detalle/:detalleId', controller.deleteDetalleOrden);

module.exports = router;