require('dotenv').config();
const express = require('express');
const mysql = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_key_123';

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token requerido' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    req.userId = decoded.id;
    next();
  });
};

// --- AUTH ENDPOINTS ---

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await mysql.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await mysql.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ id: result.insertId }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.insertId, name, email, plan: 'free' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await mysql.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Recuperación de contraseña
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await mysql.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'Email no encontrado' });

    const token = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hora

    await mysql.execute(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [token, expiry, email]
    );

    // Enviar correo (Simulado si no hay SMTP)
    console.log(`Token de recuperación para ${email}: ${token}`);
    
    // Si quieres configurar SMTP real:
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: '"WebForgeX" <noreply@webforgex.com>',
      to: email,
      subject: "Recuperación de contraseña",
      text: `Usa este token para resetear tu contraseña: ${token}`
    });
    */

    res.json({ message: 'Correo enviado con éxito (simulado en consola)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const [users] = await mysql.execute(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );
    if (users.length === 0) return res.status(400).json({ message: 'Token inválido o expirado' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await mysql.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, users[0].id]
    );

    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- SITES ENDPOINTS ---

app.get('/api/sites', verifyToken, async (req, res) => {
  try {
    const [sites] = await mysql.execute('SELECT * FROM sites WHERE user_id = ?', [req.userId]);
    res.json(sites.map(s => ({
      ...s,
      theme: typeof s.theme === 'string' ? JSON.parse(s.theme) : s.theme,
      sections: typeof s.sections === 'string' ? JSON.parse(s.sections) : s.sections
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/sites', verifyToken, async (req, res) => {
  const site = req.body;
  try {
    await mysql.execute(
      'INSERT INTO sites (id, user_id, name, type, template_id, theme, sections, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        site.id, 
        req.userId, 
        site.name, 
        site.type, 
        site.templateId, 
        JSON.stringify(site.theme), 
        JSON.stringify(site.sections), 
        site.published || false
      ]
    );
    res.json({ message: 'Sitio creado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/sites/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const site = req.body;
  try {
    await mysql.execute(
      'UPDATE sites SET name = ?, theme = ?, sections = ?, published = ? WHERE id = ? AND user_id = ?',
      [
        site.name, 
        JSON.stringify(site.theme), 
        JSON.stringify(site.sections), 
        site.published, 
        id, 
        req.userId
      ]
    );
    res.json({ message: 'Sitio actualizado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/sites/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await mysql.execute('DELETE FROM sites WHERE id = ? AND user_id = ?', [id, req.userId]);
    res.json({ message: 'Sitio eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Vista pública (No requiere token)
app.get('/api/site/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [sites] = await mysql.execute('SELECT * FROM sites WHERE id = ?', [id]);
    if (sites.length === 0) return res.status(404).json({ message: 'Sitio no encontrado' });
    
    const site = sites[0];
    res.json({
      ...site,
      theme: typeof site.theme === 'string' ? JSON.parse(site.theme) : site.theme,
      sections: typeof site.sections === 'string' ? JSON.parse(site.sections) : site.sections
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor WebForgeX corriendo en http://localhost:${PORT}`);
});
