
const http = require('http');
const app = require('./app');
const setupSocketIO = require('./src/socket/socket');

const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Set up WebSocket server
const io = setupSocketIO(server);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
