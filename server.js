const { createServer } = require('http');
const next = require('next');
const { WebSocketServer, WebSocket } = require('ws');

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 9000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  let connections = {};
  const wss = new WebSocketServer({ port: port + 1 });
  let latestMessage = null;

  wss.on("connection", (ws) => {
    const key = Math.random().toString(32).substring(2);
    connections[key] = ws;
    console.log('connections:', Object.keys(connections).length);
    ws.on("message", (message) => {
      console.log("currentSong:", message.toString());
      latestMessage = message.toString();
      Object.values(connections).forEach((client) => {
        client.send(message.toString());
      });
    });
    ws.on("close", (code, reason) => {
      delete connections[key];
      console.log("close: %s", reason.toString("utf-8"));
    });

    if (latestMessage) {
      ws.send(latestMessage);
    }
  });

  createServer(async (req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
