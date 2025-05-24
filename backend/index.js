const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const paypalRoutes = require('../API/paypal');  // Importamos las rutas de PayPal
const authRoutes = require('./auth');  // Corregimos la ruta de importación

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Ruta para las operaciones de PayPal
app.use('/API/paypal', paypalRoutes);  // Añadimos las rutas de PayPal
app.use('/api/auth', authRoutes);

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda_instrumentos'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// Rutas de instrumentos
app.get('/api/instrumentos', (req, res) => {
    db.query('SELECT * FROM instrumentos', (err, results) => {
        if (err) {
            console.error('Error al obtener instrumentos:', err);
            res.status(500).json({ error: 'Error al obtener instrumentos' });
            console.log(producto.imagen);
        } else {
            res.json(results);
        }
    });
});

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log('Rutas disponibles:');
    console.log('- POST /api/auth/register');
    console.log('- POST /api/auth/login');
    console.log('- POST /api/auth/cambiar-contrasena');
    console.log('- GET /api/instrumentos');
    console.log('- GET /test');
});