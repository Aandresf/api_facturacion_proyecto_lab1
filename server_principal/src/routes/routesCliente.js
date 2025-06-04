const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerCliente');

// GET /api/cliente
routes.get('/cliente', verifyToken, verificarRol('Lectura'), controller.getAllCliente);

// GET /api/cliente/:id
routes.get('/cliente/:id', verifyToken, verificarRol('Lectura'), controller.getClienteById);

// POST /api/cliente
routes.post('/cliente', verifyToken, verificarRol('Escritura'), controller.createCliente);

// PUT /api/cliente:id
routes.put('/cliente/:id', verifyToken, verificarRol('Actualizacion'), controller.updateCliente);

// DELETE /api/cliente:id
routes.delete('/cliente/:id', verifyToken, verificarRol('Eliminacion'), controller.deleteCliente);

module.exports = routes;
