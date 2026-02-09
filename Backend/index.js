// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/Products.js';
import orderRoutes from './routes/Orders.js'; // Import order routes
import userRoutes from './routes/UsersRoute.js'; // Import user routes

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);   
app.use('/api/orders', orderRoutes); // Add this line for order routes
app.use('/api/users', userRoutes); // Add this line for user routes

// Error handling middleware (optional, for production)
app.use((err, req, res, next) => {
  res.status(500).json({ msg: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));