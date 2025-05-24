CREATE DATABASE IF NOT EXISTS tienda_instrumentos;
USE tienda_instrumentos;

CREATE TABLE IF NOT EXISTS instrumentos (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2),
    cantidad INT,
    imagen TEXT
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO instrumentos (id, nombre, descripcion, precio, cantidad, imagen) VALUES
(1, 'Guitarra Electrica', 'Guitarra Electrica de buena calidad con cambio de cuerdas', 1500.00, 10, 'https://imgs.search.brave.com/2pkNVJ8sj-a3rk85Sh9foL0IqMFdcdDa7-VTp2jdrU8/rs:fit:860:0:0:0/g:ce/...'),
(2, 'Tambor', 'Tambor especializado para baterias u orquetas', 1000.00, 5, 'https://imgs.search.brave.com/6Hi6W0hVqyiAqbK7di6A0z3_t0c7p23ozNIQzAmA9VU/rs:fit:860:0:0:0/g:ce/...'),
(3, 'Violin', 'Violin pequeño ideal para viajes', 700.00, 15, 'https://imgs.search.brave.com/V2JetSVUu8GREbqW_XppMW0p44RJx5bBHKIsBOuEiqs/rs:fit:860:0:0:0/g:ce/...'),
(4, 'Piano', 'Piano de 73 teclas', 2500.00, 20, 'https://imgs.search.brave.com/xT_BZnF4bMTAYVY7EjAgvl3P5JKAoM6YwLUeMXTOMmc/rs:fit:860:0:0:0/g:ce/...'),
(5, 'Violin grande', 'Violin grande ideal para tenerlo en la casa', 1300.00, 8, 'https://imgs.search.brave.com/LVYKFC5n0JZCb15cwzVZjWb9b6Hru1l7MoXdu6giyIk/rs:fit:860:0:0:0/g:ce/...'),
(6, 'Saxofon', 'Violin grande ideal para tenerlo en la casa', 5.00, 10, 'https://imgs.search.brave.com/G6lLJRj-EAm-wDK8KnRmzSroEpz1m5W7o1GO5LtJf_0/rs:fit:860:0:0:0/g:ce/...');