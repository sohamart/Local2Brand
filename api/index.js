import app from '../backend/server.js';

export default function handler(req, res) {
  // Ensure that if Vercel rewrites strip or alter '/api', it is normalized for Express routes
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }
  return app(req, res);
}
