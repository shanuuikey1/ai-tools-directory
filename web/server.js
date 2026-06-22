const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

// API proxy (optional - for testing)
app.all('/api/*', (req, res) => {
  res.status(503).json({
    message: 'Backend API not configured. Deploy backend to Heroku first.',
    backend_url: 'https://urban-services-api.herokuapp.com/api'
  });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ Frontend running on http://localhost:${PORT}`);
  console.log(`✓ Open http://localhost:${PORT} in browser`);
});
