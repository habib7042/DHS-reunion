const app = require('./api/index');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Database: ${process.env.MONGO_URI ? 'Using Remote URI' : 'Using Localhost (Default)'}`);
  console.log('\x1b[33m%s\x1b[0m', 'IMPORTANT: Keep this terminal running for database access!');
  console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
});
