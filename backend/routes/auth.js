const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda_instrumentos'
});

// Ruta para registro
router.post('/register', async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;

    try {
        // Verificar si el usuario ya existe
        db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
            if (err) {
                console.error('Error al verificar usuario:', err);
                return res.status(500).json({ success: false, message: 'Error en el servidor' });
            }

            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            // Insertar nuevo usuario
            db.query(
                'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
                [nombre, correo, hashedPassword, rol],
                (err, result) => {
                    if (err) {
                        console.error('Error al registrar usuario:', err);
                        return res.status(500).json({ success: false, message: 'Error al registrar usuario' });
                    }

                    res.json({
                        success: true,
                        message: 'Usuario registrado exitosamente',
                        data: {
                            id: result.insertId,
                            nombre,
                            correo,
                            rol
                        }
                    });
                }
            );
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Ruta para login
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
            if (err) {
                console.error('Error al buscar usuario:', err);
                return res.status(500).json({ success: false, message: 'Error en el servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(contrasena, user.contrasena);

            if (!validPassword) {
                return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
            }

            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    id: user.id,
                    nombre: user.nombre,
                    correo: user.correo,
                    rol: user.rol
                }
            });
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Ruta para cambiar contraseña
router.post('/cambiar-contrasena', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        db.query(
            'UPDATE usuarios SET contrasena = ? WHERE correo = ?',
            [hashedPassword, correo],
            (err, result) => {
                if (err) {
                    console.error('Error al cambiar contraseña:', err);
                    return res.status(500).json({ success: false, message: 'Error al cambiar contraseña' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
                }

                res.json({
                    success: true,
                    message: 'Contraseña cambiada exitosamente'
                });
            }
        );
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

module.exports = router; 