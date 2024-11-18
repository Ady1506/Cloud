import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
        });

        console.log('Connected to the database');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

export default connectToDatabase;

