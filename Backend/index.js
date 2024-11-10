// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import asyncHandler from 'express-async-handler';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/users', userRoutes); // Register user routes
app.use('/api/admin', adminRoutes);

app.post('/api/sign-out', asyncHandler(async(req, res) => {
    res.clearCookie('jwt');
    res.status(200).send('User signed out successfully');
}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});
  
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
