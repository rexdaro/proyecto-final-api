const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');
const { auth, esAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json({ success: true, data: categorias });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await Producto.aggregate([
      { $group: { _id: '$categoria', total: { $sum: 1 } } },
      { $lookup: { from: 'categorias', localField: '_id', foreignField: '_id', as: 'categoria' } },
      { $unwind: '$categoria' },
      { $project: { _id: 0, categoria: '$categoria.nombre', totalProductos: '$total' } }
    ]);
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ success: false, error: 'Categoria no encontrada' });
    }
    res.json({ success: true, data: categoria });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', auth, esAdmin, async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    await categoria.save();
    res.status(201).json({ success: true, data: categoria });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', auth, esAdmin, async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoria) {
      return res.status(404).json({ success: false, error: 'Categoria no encontrada' });
    }
    res.json({ success: true, data: categoria });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', auth, esAdmin, async (req, res) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Categoria eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
