const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`🍵 CUP2EAT Backend API running on port ${PORT}`);
  console.log(`✨ Health Check: http://localhost:${PORT}/health`);
});
