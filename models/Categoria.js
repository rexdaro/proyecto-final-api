const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: String
}, { timestamps: true });

module.exports = mongoose.model('Categoria', categoriaSchema);
