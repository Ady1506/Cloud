import jwt from 'jsonwebtoken';

const verify = (req,res,next) => {
    try {
        // Get the token from the cookies
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Verify the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        // console.log(decoded);
        // Return the decoded token
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        return null;
    }
};

export default verify;