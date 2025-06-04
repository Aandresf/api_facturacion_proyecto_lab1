const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerAjustePrecio');

// GET /api/ajusteprecio
routes.get('/ajusteprecio', verifyToken, verificarRol('Lectura'), controller.getAllAjustePrecio);

// GET /api/ajusteprecio/:id
routes.get('/ajusteprecio/:id', verifyToken, verificarRol('Lectura'), controller.getAjustePrecioById);

// POST /api/ajusteprecio
routes.post('/ajusteprecio', verifyToken, verificarRol('Escritura'), controller.createAjustePrecio);

// PUT /api/ajusteprecio:id
routes.put('/ajusteprecio/:id', verifyToken, verificarRol('Actualizacion'), controller.updateAjustePrecio);

// DELETE /api/ajusteprecio:id
routes.delete('/ajusteprecio/:id', verifyToken, verificarRol('Eliminacion'), controller.deleteAjustePrecio);

module.exports = routes;