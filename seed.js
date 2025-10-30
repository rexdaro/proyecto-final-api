require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
const Categoria = require('./models/Categoria');
const Producto = require('./models/Producto');

const conectar = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Conectado');
};

const crearDatos = async () => {
  await conectar();

  await Usuario.deleteMany({});
  await Categoria.deleteMany({});
  await Producto.deleteMany({});

  const admin = await Usuario.create({
    nombre: 'Admin',
    email: 'admin@mail.com',
    password: 'admin123',
    rol: 'admin'
  });

  const cliente = await Usuario.create({
    nombre: 'Juan Perez',
    email: 'juan@mail.com',
    password: '123456',
    rol: 'cliente',
    direccion: 'Calle 123',
    telefono: '1234567890'
  });

  const cliente2 = await Usuario.create({
    nombre: 'Maria Garcia',
    email: 'maria@mail.com',
    password: '123456',
    rol: 'cliente'
  });

  const catElectronica = await Categoria.create({
    nombre: 'Electronica',
    descripcion: 'Productos electronicos'
  });

  const catRopa = await Categoria.create({
    nombre: 'Ropa',
    descripcion: 'Ropa y accesorios'
  });

  const catHogar = await Categoria.create({
    nombre: 'Hogar',
    descripcion: 'Articulos para el hogar'
  });

  await Producto.create([
    {
      nombre: 'Laptop Dell',
      descripcion: 'Laptop Dell Inspiron',
      precio: 800,
      stock: 10,
      marca: 'Dell',
      categoria: catElectronica._id
    },
    {
      nombre: 'Mouse Logitech',
      descripcion: 'Mouse inalambrico',
      precio: 25,
      stock: 50,
      marca: 'Logitech',
      categoria: catElectronica._id
    },
    {
      nombre: 'Teclado Mecanico',
      descripcion: 'Teclado RGB',
      precio: 100,
      stock: 30,
      marca: 'Razer',
      categoria: catElectronica._id
    },
    {
      nombre: 'Monitor Samsung',
      descripcion: 'Monitor 24 pulgadas',
      precio: 200,
      stock: 15,
      marca: 'Samsung',
      categoria: catElectronica._id
    },
    {
      nombre: 'Camisa',
      descripcion: 'Camisa casual',
      precio: 30,
      stock: 100,
      marca: 'Zara',
      categoria: catRopa._id
    },
    {
      nombre: 'Pantalon',
      descripcion: 'Pantalon de mezclilla',
      precio: 45,
      stock: 80,
      marca: 'Levis',
      categoria: catRopa._id
    },
    {
      nombre: 'Lampara',
      descripcion: 'Lampara de mesa',
      precio: 35,
      stock: 40,
      marca: 'Philips',
      categoria: catHogar._id
    },
    {
      nombre: 'Silla',
      descripcion: 'Silla de oficina',
      precio: 150,
      stock: 20,
      marca: 'Ikea',
      categoria: catHogar._id
    }
  ]);

  console.log('Datos creados');
  console.log('\nCredenciales:');
  console.log('Admin: admin@mail.com / admin123');
  console.log('Cliente: juan@mail.com / 123456');
  
  process.exit(0);
};

crearDatos();
