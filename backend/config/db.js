const connectDB = async () => {
  try {
    console.log('DB connected (mock)');
  } catch (error) {
    console.error('DB connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;