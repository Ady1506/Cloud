import jwt from 'jsonwebtoken';

// const verify = (req,res,next) => {
//     try {
//         // Get the token from the cookies
//         const token = req.cookies.jwt;
//         // const token = req.headers["authorization"].split(" ")[1];
//         // console.log(req.cookies)
//         if(!token) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         // Verify the token

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded.id;
//         // console.log(decoded);
//         // Return the decoded token
//         next();
//     } catch (err) {
//         console.error('Error verifying token:', err);
//         return null;
//     }
// };

// export default verify;
// authMiddleware.js or wherever the middleware is
const verify = (req, res, next) => {
    const token = req.cookies.jwt || req.header('Authorization')?.replace('Bearer ', ''); // Ensure we're extracting from cookies or Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;  // Store the decoded user information (e.g., userId) in the request object
        next();  // Pass control to the next handler (route)
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export default verify;




// import jwt from 'jsonwebtoken';

// const verify= (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

//     if (!token) {
//         return res.status(401).json({ message: 'Token not provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded.id; // Attach the decoded user ID to the request
//         next();
//     } catch (error) {
//         console.error('Invalid token:', error.message);
//         return res.status(401).json({ message: 'Invalid or expired token' });
//     }
// };
// export default verify;
// import jwt from 'jsonwebtoken';

// const verify = (req, res, next) => {
//   // Try to get the token from either the Authorization header or the cookies
//   const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

//   // Check if the token is not provided
//   if (!token) {
//     return res.status(401).json({ message: 'Token not provided' });
//   }

//   try {
//     // Verify the token using the JWT_SECRET environment variable
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Attach the decoded user ID to the request object for further use in the route
//     req.user = decoded.id; 
    
//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error('Invalid token:', error.message);
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// export default verify;
