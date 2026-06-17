import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifevault-ai';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error: Please make sure MongoDB is running or provide a valid MONGODB_URI in .env');
  });

// Start the server regardless of DB connection for UI development
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
