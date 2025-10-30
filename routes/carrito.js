const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');
const { auth } = require('../middleware/auth');

router.get('/:usuarioId', auth, async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.params.usuarioId }).populate('productos.producto');
    if (!carrito) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }
    res.json({ success: true, data: carrito });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:usuarioId/total', auth, async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.params.usuarioId }).populate('productos.producto');
    
    if (!carrito) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    let total = 0;
    const items = carrito.productos.map(item => {
      const subtotal = item.producto.precio * item.cantidad;
      total += subtotal;
      return {
        producto: item.producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio,
        subtotal
      };
    });

    res.json({ success: true, data: { items, total } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { usuario, producto, cantidad } = req.body;
    
    let carrito = await Carrito.findOne({ usuario });
    
    if (!carrito) {
      carrito = new Carrito({ usuario, productos: [{ producto, cantidad }] });
    } else {
      const existe = carrito.productos.find(p => p.producto.toString() === producto);
      if (existe) {
        existe.cantidad += cantidad;
      } else {
        carrito.productos.push({ producto, cantidad });
      }
    }
    
    await carrito.save();
    res.status(201).json({ success: true, data: carrito });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:usuarioId/producto/:productoId', auth, async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.params.usuarioId });
    
    if (!carrito) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    carrito.productos = carrito.productos.filter(
      p => p.producto.toString() !== req.params.productoId
    );
    
    await carrito.save();
    res.json({ success: true, data: carrito });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
