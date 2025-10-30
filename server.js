require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/usuarios'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/carrito', require('./routes/carrito'));
app.use('/api/ordenes', require('./routes/pedidos'));
app.use('/api/resenas', require('./routes/resenas'));

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
