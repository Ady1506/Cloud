import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.log('Connection failed:', err.message);
        return;
    }
    console.log('DB connected');
});

export default connection;
