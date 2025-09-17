const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes - send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🌟 Frontend server running on http://localhost:${port}`);
  console.log(`🔗 Main app: http://localhost:${port}`);
  console.log(`🔒 Admin panel: http://localhost:${port}/admin-secret-panel-2025-gpt5`);
});