const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✨ L'Amour Gourmet Restaurant Server running on http://localhost:${PORT}`);
});
