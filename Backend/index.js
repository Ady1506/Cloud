import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';  // Import cookie-parser
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import connectToDatabase from './config/db.js';
import { asyncHandler } from './utils/asyncHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());  // Use cookie-parser middleware to handle cookies

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Sign-out route
app.post('/api/sign-out', asyncHandler(async (req, res) => {
    // Clear the JWT token from cookies
    res.clearCookie('token');  // Update with the correct cookie name if needed
    res.status(200).send('User signed out successfully');
}));

app.get('/', (req, res) => {
    res.send('Welcome to the Attendance Tracker API!');
});

// "Not Found" middleware
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Start the server
connectToDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
    })
    .catch((error) => {
        console.error("Failed to connect to the database, shutting down...");
        process.exit(1);
    });
