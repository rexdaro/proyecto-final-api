const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Carrito = require('../models/Carrito');
const jwt = require('jsonwebtoken');
const { auth, esAdmin } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json({ success: true, data: usuario });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario || !(await usuario.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({ success: true, token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', auth, esAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', auth, esAdmin, async (req, res) => {
  try {
    await Carrito.deleteOne({ usuario: req.params.id });
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
