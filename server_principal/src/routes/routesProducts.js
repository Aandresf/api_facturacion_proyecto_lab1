const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerProducts');

// GET /api/products
routes.get('/products', controller.getAllProducts);

// POST /api/products/new
routes.post('/products', controller.createProduct);

// GET /api/products/:id
routes.get('/products/:id', controller.getProductById);

// PUT /api/products/:id
routes.put('/products/:id', controller.updateProduct)

module.exports = routes;