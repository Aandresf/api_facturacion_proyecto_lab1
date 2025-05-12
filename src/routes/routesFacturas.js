const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerFactura');

// GET /api/facturas
router.get('/facturas', controller.getAllFacturas);

// GET /api/facturas/:id
router.get('/facturas/:id', controller.getFacturaById);

// POST /api/facturas
router.post('/facturas', controller.createFactura);

// POST /api/facturas/send/:id
router.post('/facturas/send/:id', controller.sendFacturaById);

// PUT /api/facturas/:id
router.put('/facturas/:id', controller.updateFactura);

// DELETE /api/facturas/:id
router.delete('/facturas/:id', controller.deleteFactura);

module.exports = router;