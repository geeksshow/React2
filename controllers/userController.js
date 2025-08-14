import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Create a new user
export function createUser(req, res) {
    try {
        // Check if user already exists
        User.findOne({ email: req.body.email })
            .then((existingUser) => {
                if (existingUser) {
                    return res.status(400).json({
                        message: "User with this email already exists"
                    });
                }

                // Role validation for admin creation
                if (req.body.role === "admin") {
                    if (!req.user || req.user.role !== "admin") {
                        return res.status(403).json({
                            message: "Unauthorized to create admin users"
                        });
                    }
                }

                const hashedPassword = bcrypt.hashSync(req.body.password, 10);

                const user = new User({
                    email: req.body.email,
                    firstname: req.body.firstname || req.body.firstName, // Handle both field names
                    lastname: req.body.lastname || req.body.lastName,   // Handle both field names
                    password: hashedPassword,
                    phone: req.body.phone,
                    company: req.body.company,
                    role: req.body.role || "customer"
                });

                user.save()
                    .then(() => {
                        res.status(201).json({
                            message: "User Created Successfully",
                            user: {
                                email: user.email,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                phone: user.phone,
                                company: user.company,
                                role: user.role
                            }
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: "Error saving user",
                            error: error.message,
                        });
                    });
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error checking existing user",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Login user
export function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        User.findOne({ email: email })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({
                        message: "User Not Found"
                    });
                }

                if (user.isBlocked) {
                    return res.status(403).json({
                        message: "Account is blocked. Please contact administrator."
                    });
                }

                const isPasswordCorrect = bcrypt.compareSync(password, user.password);
                if (isPasswordCorrect) {
                    const token = jwt.sign({
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        role: user.role,
                        img: user.img,
                        userId: user._id
                    }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

                    res.json({
                        message: "Login Successful",
                        token: token,
                        user: {
                            email: user.email,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            role: user.role,
                            img: user.img,
                            userId: user._id
                        }
                    });
                } else {
                    res.status(401).json({
                        message: "Invalid Password",
                    });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error during login",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Get user profile
export function getUserProfile(req, res) {
    try {
        User.findOne({ email: req.user.email })
            .select('-password')
            .then((user) => {
                if (!user) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }
                res.json({
                    user: user
                });
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error fetching user profile",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Update user profile
export function updateUserProfile(req, res) {
    try {
        const { firstname, lastname, phone, company, img } = req.body;
        const updateData = {};

        console.log('Received update data:', { firstname, lastname, phone, company, img }); // Debug log

        if (firstname) updateData.firstname = firstname;
        if (lastname) updateData.lastname = lastname;
        if (phone !== undefined) updateData.phone = phone;
        if (company !== undefined) updateData.company = company;
        if (img) updateData.img = img;

        console.log('Final update data:', updateData); // Debug log

        User.findOneAndUpdate(
            { email: req.user.email },
            updateData,
            { new: true, runValidators: true }
        )
            .select('-password')
            .then((updatedUser) => {
                if (!updatedUser) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }
                console.log('Updated user from database:', updatedUser); // Debug log
                res.json({
                    message: "Profile updated successfully",
                    user: updatedUser
                });
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error updating profile",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Change password
export function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        User.findOne({ email: req.user.email })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }

                const isCurrentPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
                if (!isCurrentPasswordCorrect) {
                    return res.status(401).json({
                        message: "Current password is incorrect"
                    });
                }

                const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
                user.password = hashedNewPassword;

                user.save()
                    .then(() => {
                        res.json({
                            message: "Password changed successfully"
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: "Error saving new password",
                            error: error.message,
                        });
                    });
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error finding user",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Logout (client-side token removal, but we can invalidate if needed)
export function logout(req, res) {
    try {
        // In a more advanced setup, you could add the token to a blacklist
        res.json({
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Admin: Get all users
export function getAllUsers(req, res) {
    try {
        User.find({})
            .select('-password')
            .then((users) => {
                res.json({
                    users: users
                });
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error fetching users",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Admin: Block/Unblock user
export function toggleUserBlock(req, res) {
    try {
        const { userId } = req.params;
        const { isBlocked } = req.body;

        User.findByIdAndUpdate(
            userId,
            { isBlocked: isBlocked },
            { new: true, runValidators: true }
        )
            .select('-password')
            .then((updatedUser) => {
                if (!updatedUser) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }
                res.json({
                    message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
                    user: updatedUser
                });
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error updating user status",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Admin: Change user role
export function changeUserRole(req, res) {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['customer', 'admin'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Must be 'customer' or 'admin'"
            });
        }

        User.findByIdAndUpdate(
            userId,
            { role: role },
            { new: true, runValidators: true }
        )
            .select('-password')
            .then((updatedUser) => {
                if (!updatedUser) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }
                res.json({
                    message: "User role updated successfully",
                    user: updatedUser
                });
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error updating user role",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Delete user account (user can delete their own account, admin can delete any)
export function deleteUser(req, res) {
    try {
        const { userId } = req.params;
        const requestingUser = req.user;

        // Check if user exists
        User.findById(userId)
            .then((userToDelete) => {
                if (!userToDelete) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }

                // Check permissions: user can delete their own account, admin can delete any
                if (requestingUser.role !== 'admin' && requestingUser.email !== userToDelete.email) {
                    return res.status(403).json({
                        message: "You can only delete your own account"
                    });
                }

                // Delete the user
                User.findByIdAndDelete(userId)
                    .then(() => {
                        res.json({
                            message: "User account deleted successfully"
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: "Error deleting user account",
                            error: error.message,
                        });
                    });
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error finding user",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Utility function for role checking
export function isAdmin(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role !== "admin") {
        return false;
    }
    return true;
}



