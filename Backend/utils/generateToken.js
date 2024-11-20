// import jwt from "jsonwebtoken";

// // Generate token function using studentId
// const generateToken = (studentId) => {
//     // Generate JWT token for the student
//     return jwt.sign({ studentId }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// // If you still want to use cookies for JWT (as in your previous code), you can add that as an option
// const generateTokenWithCookie = (res, studentId) => {
//     const token = jwt.sign({ studentId }, process.env.JWT_SECRET, { expiresIn: '30d' });
//     res.cookie("jwt", token, {
//         httpOnly: true,
//         maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//         secure: process.env.NODE_ENV === 'production', // Secure only in production
//         sameSite: "strict",
//     });
//     return token; // Return the token for possible logging/testing
// };

// export { generateToken, generateTokenWithCookie };
// import jwt from 'jsonwebtoken';

// const generateToken = (studentId) => {
//     return jwt.sign({ studentId }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// export default generateToken;
import jwt from 'jsonwebtoken';

const generateToken = (res, id) => {
    try {
        // Create the token
        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token in an HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true, // Prevent access to the cookie from JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 60 * 60 * 1000, // Token expiration time (1 hour)
        });

        return token; // Return the token for any further use, optional
    } catch (err) {
        console.error('Error generating token:', err);
        throw new Error('Failed to generate token');
    }
};

export default generateToken;

