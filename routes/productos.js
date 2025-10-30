const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Resena = require('../models/Resena');
const { auth, esAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().populate('categoria');
    res.json({ success: true, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/filtro', async (req, res) => {
  try {
    const { precioMin, precioMax, marca } = req.query;
    
    let filtro = {};
    if (precioMin || precioMax) {
      filtro.precio = {};
      if (precioMin) filtro.precio.$gte = Number(precioMin);
      if (precioMax) filtro.precio.$lte = Number(precioMax);
    }
    if (marca) filtro.marca = marca;

    const productos = await Producto.find(filtro).populate('categoria');
    res.json({ success: true, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/top', async (req, res) => {
  try {
    const topProductos = await Resena.aggregate([
      { $group: { _id: '$producto', total: { $count: {} } } },
      { $sort: { total: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'productos', localField: '_id', foreignField: '_id', as: 'producto' } },
      { $unwind: '$producto' },
      { $project: { _id: 0, producto: '$producto', totalResenas: '$total' } }
    ]);
    
    res.json({ success: true, data: topProductos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('categoria');
    if (!producto) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', auth, esAdmin, async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json({ success: true, data: producto });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', auth, esAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!producto) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch('/:id/stock', auth, esAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { $set: { stock } },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', auth, esAdmin, async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
