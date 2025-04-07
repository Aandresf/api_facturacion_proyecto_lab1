const express = require('express');
const router = express.Router();
const controllerItemAjuste = require('../controllers/controllerItemAjuste');

// Rutas para ITEM_AJUSTE
router.get('/', controllerItemAjuste.getAllItemAjustes);
router.get('/:id', controllerItemAjuste.getItemAjusteById);
router.post('/', controllerItemAjuste.createItemAjuste);
router.put('/', controllerItemAjuste.updateItemAjuste);
router.delete('/:id', controllerItemAjuste.deleteItemAjuste);

module.exports = router;