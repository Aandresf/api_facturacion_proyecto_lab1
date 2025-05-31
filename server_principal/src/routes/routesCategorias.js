const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerCategorias');

// GET /api/categorias
routes.get('/categorias', controller.getAllCategorias);

// GET /api/categorias/:id
routes.get('/categorias/:id', controller.getCategoriaById);

// POST /api/categorias
routes.post('/categorias', controller.createCategoria);

// PUT /api/categorias:id
routes.put('/categorias/:id', controller.updateCategoria);

// DELETE /api/categorias:id
routes.delete('/categorias/:id', controller.deleteCategoria);

module.exports = routes;
