const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const paypalRoutes = require('./paypal');  // Importamos las rutas de PayPal

const app = express();
app.use(cors());
app.use(express.json());
// Ruta para las operaciones de PayPal
app.use('/api/paypal', paypalRoutes);  // Añadimos las rutas de PayPal

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
        } else {
            res.json(results);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});