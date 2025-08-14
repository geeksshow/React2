import { body, validationResult } from 'express-validator';

// Validation rules for user registration
export const validateRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

// Validation rules for user login
export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Validation rules for profile update
export const validateProfileUpdate = [
    body('firstname')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastname')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('img')
        .optional()
        .isURL()
        .withMessage('Image must be a valid URL')
];

// Validation rules for password change
export const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
];

// Validation rules for admin operations
export const validateUserBlock = [
    body('isBlocked')
        .isBoolean()
        .withMessage('isBlocked must be a boolean value')
];

export const validateUserRole = [
    body('role')
        .isIn(['customer', 'admin'])
        .withMessage('Role must be either "customer" or "admin"')
];

// Middleware to check for validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }
    next();
};

// Sanitize user input
export const sanitizeInput = (req, res, next) => {
    // Remove leading/trailing whitespace from string fields
    if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
    if (req.body.phone) req.body.phone = req.body.phone.trim();
    if (req.body.company) req.body.company = req.body.company.trim();
    if (req.body.firstname) req.body.firstname = req.body.firstname.trim();
    if (req.body.lastname) req.body.lastname = req.body.lastname.trim();
    if (req.body.firstName) req.body.firstName = req.body.firstName.trim();
    if (req.body.lastName) req.body.lastName = req.body.lastName.trim();

    next();
};
