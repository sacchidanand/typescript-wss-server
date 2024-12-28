"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const ws_1 = require("ws");
const PORT = process.env.PORT || 3000;
// Create the HTTP server
const server = (0, http_1.createServer)((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('HTTP Server with WebSocket support!');
});
// Create the WebSocket server
const wss = new ws_1.WebSocketServer({ server });
// Broadcast a message to all connected clients
function broadcastMessage(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(message);
        }
    });
}
// Heartbeat function to keep the connection alive
function heartbeat() {
    this.isAlive = true;
}
// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');
    ws.isAlive = true;
    // Attach heartbeat listener
    ws.on('pong', heartbeat.bind(ws)); // Use bind to explicitly bind `this` to `ws`
    // Send a welcome message to the client
    ws.send('Welcome to the WebSocket server!');
    // Handle incoming messages from clients
    ws.on('message', (message) => {
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
        const ws = client; // Type assertion
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
