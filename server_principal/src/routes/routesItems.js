const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerItem');

// GET /api/items
routes.get('/', controller.getAllItems);

// GET /api/items/:id
routes.get('/:id', controller.getItemById);

// GET /api/items/categoria/:id
routes.get('/categoria/:id', controller.getItemByCategoriaId);

// GET /api/items/tipo/:tipo
routes.get('/tipo/:tipo', controller.getItemByTipo);

// POST /api/items
routes.post('/', controller.createItem);

// PUT /api/items:id
routes.put('/:id', controller.updateItem);

// DELETE /api/items:id
routes.delete('/:id', controller.deleteItem);

module.exports = routes;
