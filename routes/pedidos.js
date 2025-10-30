const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const { auth, esAdmin } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('usuario', 'nombre email').populate('items.producto');
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats', auth, esAdmin, async (req, res) => {
  try {
    const stats = await Pedido.aggregate([
      { $group: { _id: '$estado', total: { $sum: 1 } } },
      { $project: { _id: 0, estado: '$_id', totalPedidos: '$total' } }
    ]);
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/user/:userId', auth, async (req, res) => {
  try {
    if (req.usuario._id.toString() !== req.params.userId && req.usuario.rol !== 'admin') {
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    const pedidos = await Pedido.find({ usuario: req.params.userId }).populate('items.producto');
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate('usuario').populate('items.producto');
    if (!pedido) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }
    res.json({ success: true, data: pedido });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const pedido = new Pedido({
      ...req.body,
      usuario: req.usuario._id
    });
    await pedido.save();
    res.status(201).json({ success: true, data: pedido });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch('/:id/status', auth, esAdmin, async (req, res) => {
  try {
    const { estado } = req.body;
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { $set: { estado } },
      { new: true }
    );
    
    if (!pedido) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }
    
    res.json({ success: true, data: pedido });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', auth, esAdmin, async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Pedido eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
