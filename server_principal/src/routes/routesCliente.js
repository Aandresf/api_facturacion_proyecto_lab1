const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerCliente');

// GET /api/cliente
routes.get('/cliente', controller.getAllCliente);

// GET /api/cliente/:id
routes.get('/cliente/:id', controller.getClienteById);

// POST /api/cliente
routes.post('/cliente', controller.createCliente);

// PUT /api/cliente:id
routes.put('/cliente/:id', controller.updateCliente);

// DELETE /api/cliente:id
routes.delete('/cliente/:id', controller.deleteCliente);

module.exports = routes;
