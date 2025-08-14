import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Check if user still exists in database
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Account is blocked' });
        }

        // Set the full user object from database, not just the JWT payload
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!Array.isArray(roles) ? roles !== req.user.role : !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

        next();
    };
};

export const isAdmin = (req, res, next) => {
    requireRole(['admin'])(req, res, next);
};

export const isCustomer = (req, res, next) => {
    requireRole(['customer', 'admin'])(req, res, next);
};
