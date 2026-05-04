-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS webforgex;
USE webforgex;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    plan ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Sitios/Proyectos
CREATE TABLE IF NOT EXISTS sites (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    template_id VARCHAR(50) DEFAULT NULL,
    theme JSON NOT NULL,
    sections JSON NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
