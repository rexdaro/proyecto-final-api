const express = require('express');
const router = express.Router();
const Resena = require('../models/Resena');
const Pedido = require('../models/Pedido');
const { auth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const resenas = await Resena.find().populate('usuario', 'nombre').populate('producto', 'nombre');
    res.json({ success: true, data: resenas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/product/:productId', async (req, res) => {
  try {
    const resenas = await Resena.find({ producto: req.params.productId }).populate('usuario', 'nombre');
    res.json({ success: true, data: resenas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/top', async (req, res) => {
  try {
    const topResenas = await Resena.aggregate([
      { $group: { _id: '$producto', promedioCalificacion: { $avg: '$calificacion' }, totalResenas: { $sum: 1 } } },
      { $sort: { promedioCalificacion: -1 } },
      { $lookup: { from: 'productos', localField: '_id', foreignField: '_id', as: 'producto' } },
      { $unwind: '$producto' },
      { $project: { _id: 0, producto: '$producto.nombre', promedioCalificacion: 1, totalResenas: 1 } }
    ]);
    
    res.json({ success: true, data: topResenas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { producto, calificacion, comentario } = req.body;
    
    const haComprado = await Pedido.findOne({
      usuario: req.usuario._id,
      'items.producto': producto
    });

    if (!haComprado) {
      return res.status(403).json({ success: false, error: 'Debes comprar el producto para dejar una resena' });
    }

    const resena = new Resena({
      usuario: req.usuario._id,
      producto,
      calificacion,
      comentario
    });

    await resena.save();
    res.status(201).json({ success: true, data: resena });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const resena = await Resena.findById(req.params.id);
    
    if (!resena) {
      return res.status(404).json({ success: false, error: 'Resena no encontrada' });
    }

    if (resena.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ success: false, error: 'No puedes editar esta resena' });
    }

    resena.calificacion = req.body.calificacion || resena.calificacion;
    resena.comentario = req.body.comentario || resena.comentario;
    
    await resena.save();
    res.json({ success: true, data: resena });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const resena = await Resena.findById(req.params.id);
    
    if (!resena) {
      return res.status(404).json({ success: false, error: 'Resena no encontrada' });
    }

    if (resena.usuario.toString() !== req.usuario._id.toString() && req.usuario.rol !== 'admin') {
      return res.status(403).json({ success: false, error: 'No puedes eliminar esta resena' });
    }

    await Resena.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resena eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
