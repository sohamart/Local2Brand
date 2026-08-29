const app = require('./app');
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✨ L'Amour Gourmet Restaurant Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
