const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();



app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lumiprep.vercel.app",        
    "https://lumiprep-vert.vercel.app"    
  ],
  credentials: true,
}));



app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tests', testRoutes);

app.get('/', (req, res) => {
  res.send('LumiPrep API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
