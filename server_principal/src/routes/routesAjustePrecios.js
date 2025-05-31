const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerAjustePrecio');

// GET /api/ajusteprecio
routes.get('/ajusteprecio', controller.getAllAjustePrecio);

// GET /api/ajusteprecio/:id
routes.get('/ajusteprecio/:id', controller.getAjustePrecioById);

// POST /api/ajusteprecio
routes.post('/ajusteprecio', controller.createAjustePrecio);

// PUT /api/ajusteprecio:id
routes.put('/ajusteprecio/:id', controller.updateAjustePrecio);

// DELETE /api/ajusteprecio:id
routes.delete('/ajusteprecio/:id', controller.deleteAjustePrecio);

module.exports = routes;