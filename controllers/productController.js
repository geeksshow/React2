import Product from "../models/product.js"; 
import { isAdmin } from "./userController.js";

export async function getProducts(req, res) {
    try {
        const user = req.user; 
        let products;

        if (user && isAdmin(req)) {
            // Admin sees all products including pending ones
            products = await Product.find().populate('submittedBy', 'firstname lastname email');
        } else {
            // Regular users only see approved and available products
            products = await Product.find({ 
                status: 'approved', 
                isAvailable: true 
            });
        }

        res.json(products);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get products",
            error: err.message, 
        });
    }
}

// Get pending products for admin review
export async function getPendingProducts(req, res) {
    try {
        console.log('Getting pending products, user role:', req.user?.role);
        
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Admin access required"
            });
        }

        const pendingProducts = await Product.find({ status: 'pending' })
            .populate('submittedBy', 'firstname lastname email')
            .sort({ submittedAt: -1 });

        console.log('Found pending products:', pendingProducts.length);
        res.json(pendingProducts);
    } catch (error) {
        console.error('Error in getPendingProducts:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching pending products",
            error: error.message
        });
    }
}

// Submit a new product (for logged-in users)
export async function submitProduct(req, res) {
    try {
        console.log('Product submission request received:', {
            body: req.body,
            user: req.user,
            userId: req.user?._id
        });

        const { productname, altName, description, images, labelledPrice, price, stock, category, subcategory, ingredients, allergens, calories, protein, carbs, fat, fiber, organicCertification } = req.body;
        
        // Validate required fields
        if (!productname || !description || !category || !subcategory || !labelledPrice || !price || !stock) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                required: ['productname', 'description', 'category', 'subcategory', 'labelledPrice', 'price', 'stock']
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        // Generate unique product ID
        const productId = 'P' + Date.now() + Math.random().toString(36).substr(2, 5);
        
        const newProduct = new Product({
            product_id: productId,
            productname,
            altName: altName || '',
            description,
            images: Array.isArray(images) ? images : [images],
            labelledPrice: parseFloat(labelledPrice),
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            subcategory,
            ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
            allergens: Array.isArray(allergens) ? allergens : [allergens],
            // Nutritional information as separate fields
            calories: calories ? parseFloat(calories) : undefined,
            protein: protein ? parseFloat(protein) : undefined,
            carbs: carbs ? parseFloat(carbs) : undefined,
            fat: fat ? parseFloat(fat) : undefined,
            fiber: fiber ? parseFloat(fiber) : undefined,
            organicCertification: organicCertification || '',
            submittedBy: req.user._id,
            status: 'pending',
            isAvailable: false // Not available until approved
        });

        console.log('Attempting to save product:', newProduct);

        await newProduct.save();

        console.log('Product saved successfully:', newProduct._id);
        console.log('Product status:', newProduct.status);
        console.log('Product submittedAt:', newProduct.submittedAt);
        console.log('Product submittedBy:', newProduct.submittedBy);

        res.status(201).json({
            success: true,
            message: "Product submitted successfully! It will be reviewed by admin before publishing.",
            productId: newProduct.product_id
        });
    } catch (error) {
        console.error('Product submission error:', error);
        res.status(500).json({
            success: false,
            message: "Error submitting product",
            error: error.message
        });
    }
}

// Admin approve/reject product
export async function reviewProduct(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Admin access required"
            });
        }

        const { productId } = req.params;
        const { action, rejectionReason } = req.body;

        console.log('Reviewing product:', productId, 'action:', action);
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be either 'approve' or 'reject'"
            });
        }

        const updateData = {
            status: action === 'approve' ? 'approved' : 'rejected',
            reviewedBy: req.user._id,
            reviewedAt: new Date()
        };

        if (action === 'approve') {
            updateData.isAvailable = true;
        } else if (action === 'reject' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        ).populate('submittedBy', 'firstname lastname email');

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        console.log('Product updated successfully:', updatedProduct._id, 'new status:', updatedProduct.status);
        res.json({
            success: true,
            message: `Product ${action}d successfully`,
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error in reviewProduct:', error);
        res.status(500).json({
            success: false,
            message: "Error reviewing product",
            error: error.message
        });
    }
}

// Save a new product (admin only - direct save without approval)
export function saveProducts(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    const newProduct = new Product({
        ...req.body,
        status: 'approved',
        isAvailable: true
    });

    newProduct
        .save()
        .then(() => {
            res.status(201).json({
                success: true,
                message: "Product added successfully",
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Error saving product",
                error: error.message,
            });
        });
}

// Delete a product
export async function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    try {
        await Product.deleteOne({ product_id: req.params.product_id });
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message,
        });
    }
}

// Update a product
export async function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    try {
        await Product.updateOne({ product_id: req.params.product_id }, req.body);
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating product",
            error: error.message,
        });
    }
}

// Get product by ID
export async function getProductById(req, res) {
    try {
        const product_id = req.params.product_id;
        const product = await Product.findOne({ product_id: product_id })
            .populate('submittedBy', 'firstname lastname email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: error.message
        });
    }
}

// Get all products (admin only)
export async function getAllProducts(req, res) {
    try {
        const products = await Product.find().populate('submittedBy', 'firstname lastname email');
        res.json({ products });
    } catch (err) {
        res.status(500).json({
            message: "Failed to get all products",
            error: err.message, 
        });
    }
}

// Add new product (admin only)
export async function addProduct(req, res) {
    try {
        const { name, description, price, category, subcategory, stock, image } = req.body;
        
        // Generate unique product ID
        const productId = 'P' + Date.now() + Math.random().toString(36).substr(2, 5);
        
        const newProduct = new Product({
            product_id: productId,
            productname: name,
            description,
            images: image ? [image] : [],
            price,
            stock,
            category,
            subcategory,
            status: 'approved',
            isAvailable: true,
            submittedBy: req.user._id
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product added successfully!",
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding product",
            error: error.message
        });
    }
}
