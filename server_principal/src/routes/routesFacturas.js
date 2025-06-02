const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerFactura');

// GET /api/facturas
router.get('/facturas', verifyToken, verificarRol('Lectura'), controller.getAllFacturas);

// GET /api/facturas/:id
router.get('/facturas/:id', verifyToken, verificarRol('Lectura'), controller.getFacturaById);

// POST /api/facturas
router.post('/facturas', verifyToken, verificarRol('Escritura'), controller.createFactura);

// POST /api/facturas/send/:id
router.post('/facturas/send/:id', verifyToken, verificarRol('Escritura'), controller.sendFacturaById);

// PUT /api/facturas/:id
router.put('/facturas/:id', verifyToken, verificarRol('Actualizacion'), controller.updateFactura);

// DELETE /api/facturas/:id
router.delete('/facturas/:id', verifyToken, verificarRol('Eliminacion'), controller.deleteFactura);

module.exports = router;