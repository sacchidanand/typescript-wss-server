import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Extend the WebSocket type to include `isAlive`
interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

const PORT = process.env.PORT || 3000;

// Create the HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('HTTP Server with WebSocket support!');
});

// Create the WebSocket server
const wss = new WebSocketServer({ server });

// Broadcast a message to all connected clients
function broadcastMessage(message: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Heartbeat function to keep the connection alive
function heartbeat(this: ExtWebSocket) {
  this.isAlive = true;
}

// Handle WebSocket connections
wss.on('connection', (ws: ExtWebSocket) => {
  console.log('New WebSocket connection established.');
  ws.isAlive = true;

  // Attach heartbeat listener
  ws.on('pong', heartbeat.bind(ws));  // Use bind to explicitly bind `this` to `ws`

  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');

  // Handle incoming messages from clients
  ws.on('message', (message: string) => {
    console.log(`Received: ${message}`);
    broadcastMessage(`Broadcast: ${message}`);
  });

  // Handle client disconnections
  ws.on('close', () => {
    console.log('Client disconnected.');
  });
});

// Periodically check for inactive clients
const interval = setInterval(() => {
  wss.clients.forEach((client) => {
    const ws = client as ExtWebSocket; // Type assertion
    if (!ws.isAlive) {
      console.log('Terminating inactive connection.');
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(); // Send a ping message to check if the client is alive
  });
}, 30000); // Every 30 seconds

// Stop the heartbeat interval when the server closes
wss.on('close', () => {
  clearInterval(interval);
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('WebSocket server is ready.');
});
