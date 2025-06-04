const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerCategorias');

// GET /api/categorias
routes.get('/categorias', verifyToken, verificarRol('Lectura'), controller.getAllCategorias);

// GET /api/categorias/:id
routes.get('/categorias/:id', verifyToken, verificarRol('Lectura'), controller.getCategoriaById);

// POST /api/categorias
routes.post('/categorias', verifyToken, verificarRol('Escritura'), controller.createCategoria);

// PUT /api/categorias:id
routes.put('/categorias/:id', verifyToken, verificarRol('Actualizacion'), controller.updateCategoria);

// DELETE /api/categorias:id
routes.delete('/categorias/:id', verifyToken, verificarRol('Eliminacion'), controller.deleteCategoria);

module.exports = routes;
