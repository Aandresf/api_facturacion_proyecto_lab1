const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerCorreo');

routes.get('/', controller.getAllCorreos);
routes.get('/:id', controller.getCorreoById);
routes.post('/', controller.createCorreo);
routes.put('/:id', controller.updateCorreo);
routes.delete('/:id', controller.deleteCorreo);

routes.param('id', async (req, res, next, id) => {
    const validationResult = await controller.validateCorreo(id);
    if (validationResult === true) {
        next();
    } else {
        res.status(400).json({ errors: validationResult });
    }
});

module.exports = routes;