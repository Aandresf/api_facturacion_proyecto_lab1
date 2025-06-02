const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerProducts');

// GET /api/products
routes.get('/products', verifyToken, verificarRol('Lectura'), controller.getAllProducts);

// POST /api/products/new
routes.post('/products', verifyToken, verificarRol('Escritura'), controller.createProduct);

// GET /api/products/:id
routes.get('/products/:id', verifyToken, verificarRol('Lectura'), controller.getProductById);

// PUT /api/products/:id
routes.put('/products/:id', verifyToken, verificarRol('Actualizacion'), controller.updateProduct)

module.exports = routes;