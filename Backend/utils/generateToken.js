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

