const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tests', testRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
