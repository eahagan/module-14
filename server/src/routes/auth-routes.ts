import { Router, Request, Response } from 'express';
import { User } from '../models/user';  // Import your User model
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Login function
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },  // Payload
      process.env.JWT_SECRET!,  // Secret key from .env
      { expiresIn: '1h' }  // Set the token expiration (optional)
    );

    // Send the token in the response
    res.json({ token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;

