const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerOrden');

// GET /api/ordenes
router.get('/', controller.getAllOrden);

// GET /api/ordenes/:id
router.get('/:ordenId', controller.getOrdenById);

// POST /api/ordenes
router.post('/', controller.createOrden);

// POST /api/ordenes/:ordenId/detalle
router.post('/:ordenId/detalle', controller.createDetalleOrden);

// PUT /api/ordenes/:id
router.put('/:ordenId', controller.updateOrden);

// PUT /api/ordenes/detalle/:id
router.put('/detalle/:detalleId', controller.updateDetalleOrden);

// DELETE /api/ordenes/:id
router.delete('/:ordenId', controller.deleteOrden);

// DELETE /api/ordenes/detalle/:id
router.delete('/detalle/:detalleId', controller.deleteDetalleOrden);


module.exports = router;