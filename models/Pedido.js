const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  items: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    },
    cantidad: Number,
    subtotal: Number
  }],
  total: {
    type: Number
  },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  metodoPago: String
}, { timestamps: true });

pedidoSchema.pre("save", async function (next){

  const Producto = mongoose.model("Producto")

  // Busca los productos que estan en el pedido

      const productos = await Producto.find({
      _id: { $in: this.items.map(i => i.producto) }
    });

  // calculamos subtotal para cada item
          this.items = this.items.map(i => {
      const prod = productos.find(p => p._id.equals(i.producto));
      i.subtotal = prod ? prod.precio * i.cantidad : 0;
      return i;
    });

    // calculamos el total del pedido

    this.total = this.items.reduce((acc, item) => acc + item.subtotal, 0);

   next()


})

module.exports = mongoose.model('Pedido', pedidoSchema);
