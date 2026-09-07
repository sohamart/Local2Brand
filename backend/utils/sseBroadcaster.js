// Real-Time Server-Sent Events (SSE) Broadcaster for Live Site Customizations
const clients = new Set();

/**
 * Register a new client for SSE site settings stream
 */
export const registerSettingsListener = (req, res) => {
  // Set headers for Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable buffering for Nginx/proxies
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Credentials': 'true',
  });

  // Initial connection handshake
  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', timestamp: Date.now() })}\n\n`);

  // Add client to active subscriber set
  clients.add(res);

  // Keep connection alive with periodic 20-second heartbeat ping
  const keepAliveInterval = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch (e) {
      clearInterval(keepAliveInterval);
      clients.delete(res);
    }
  }, 20000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(keepAliveInterval);
    clients.delete(res);
  });

  req.on('error', () => {
    clearInterval(keepAliveInterval);
    clients.delete(res);
  });
};

/**
 * Broadcast updated site settings to all connected SSE clients in real-time
 */
export const broadcastSiteSettingsUpdate = (settings) => {
  if (!settings) return;

  const payload = `event: settings_updated\ndata: ${JSON.stringify(settings)}\n\n`;

  for (const client of clients) {
    try {
      client.write(payload);
    } catch (err) {
      clients.delete(client);
    }
  }
};

export const getConnectedClientsCount = () => clients.size;
