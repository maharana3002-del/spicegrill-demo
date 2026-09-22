require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Initialize database with sample demo seed
require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API
app.use('/api', apiRoutes);

// Static file serving
const publicPath = path.join(__dirname, '../');
app.use(express.static(publicPath));

// Admin Dashboard Route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicPath, 'admin', 'index.html'));
});

// Customer Storefront Fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API Route Not Found' });
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
============================================================
✨ SPICE GRILL — RESTAURANT WEBSITE CONCEPT DEMO ✨
============================================================
🌐 Customer Concept Storefront: http://localhost:${PORT}
🛠️ Demo Admin Dashboard:       http://localhost:${PORT}/admin
📡 REST API Health:             http://localhost:${PORT}/api/health
⚠️ Notice: Unofficial demo concept for portfolio showcase.
============================================================
  `);
});
