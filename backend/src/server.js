import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` CampusCare Backend API running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to boot CampusCare Server:', err);
    process.exit(1);
  });
