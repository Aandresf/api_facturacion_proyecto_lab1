const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerDetallesOrden');

// GET /api/detalles-orden
router.get('/', controller.getAllDetallesOrden);

// GET /api/detalles-orden/:ordenId
router.get('/:ordenId', controller.getDetallesOrdenByOrdenId);

// POST /api/detalles-orden
router.post('/', controller.createDetallesOrden);

// PUT /api/detalles-orden/:id
router.put('/:id', controller.updateDetalleOrden);

// DELETE /api/detalles-orden/:id
router.delete('/:id', controller.deleteDetalleOrden);

module.exports = router;