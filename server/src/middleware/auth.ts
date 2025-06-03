import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface for the JWT payload
interface JwtPayload {
  username: string;
  id: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from header

  // If no token is provided, return an unauthorized error
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify the token using the secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' }); // Token is invalid
    }

    // Add the decoded user data (e.g., username, user id) to the request object
    // This allows you to access the user data in the next route handler
    req.user = decoded as JwtPayload; 

    // Proceed to the next middleware or route handler
    next();
  });
};

