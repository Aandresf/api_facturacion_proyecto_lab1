const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerFactura');

// GET /api/facturas
router.get('/', controller.getAllFacturas);

// GET /api/facturas/:id
router.get('/:id', controller.getFacturaById);

// POST /api/facturas
router.post('/', controller.createFactura);

// POST /api/facturas/send/:id
router.get('/send/:id', controller.sendFacturaById);

// PUT /api/facturas/:id
router.put('/:id', controller.updateFactura);

// DELETE /api/facturas/:id
router.delete('/:id', controller.deleteFactura);

module.exports = router;