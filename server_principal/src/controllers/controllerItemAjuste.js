const modelsItemAjuste = require('../models/modelsItemAjuste');

// Obtener todos los registros
exports.getAllItemAjustes = async (req, res) => {
  try {
    const itemAjustes = await modelsItemAjuste.selectAllItemAjustes();
    res.status(200).json(itemAjustes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un registro por ID
exports.getItemAjusteById = async (req, res) => {
  try {
    const itemAjuste = await modelsItemAjuste.selectItemAjusteById(req.params.id);
    if (itemAjuste.length === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.status(200).json(itemAjuste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo registro
exports.createItemAjuste = async (req, res) => {
  try {
    const itemAjuste = await modelsItemAjuste.insertItemAjuste(req.body);
    res.status(201).json(itemAjuste);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un registro
exports.updateItemAjuste = async (req, res) => {
  try {
    const itemAjuste = await modelsItemAjuste.updateItemAjuste(req.body);
    if (itemAjuste.length === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.status(200).json(itemAjuste);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un registro
exports.deleteItemAjuste = async (req, res) => {
  try {
    const itemAjuste = await modelsItemAjuste.deleteItemAjuste(req.params.id);
    if (itemAjuste.length === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.status(200).json({ message: 'Registro eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};