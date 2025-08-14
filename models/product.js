import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        unique: true
    },
    productname: {
        type: String,
        required: true
    },
    altName: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    labelledPrice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    },
    // New fields for approval system
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    },
    rejectionReason: {
        type: String
    },
    // Category fields for organic products
    category: {
        type: String,
        required: true,
        enum: [
            'Organic Tea & Beverages',
            'Organic Sweeteners',
            'Organic Snacks, Fruits & Nuts',
            'Organic Grains, Beans & Pulses',
            'Organic Pantry & Kitchen',
            'Organic Spices, Herbs & Seasonings',
            'Organic Plant-Based Dairy Alternatives',
            'Organic Condiments & Sauces',
            'Fresh',
            'Organic Superfoods & Supplements',
            'Organic Ready Meals'
        ]
    },
    subcategory: {
        type: String,
        required: true
    },
    // Additional organic product fields
    isOrganic: {
        type: Boolean,
        default: true
    },
    organicCertification: {
        type: String
    },
    ingredients: [{
        type: String
    }],
    allergens: [{
        type: String
    }],
    // Nutritional information as separate fields to match frontend form
    calories: {
        type: Number
    },
    protein: {
        type: Number
    },
    carbs: {
        type: Number
    },
    fat: {
        type: Number
    },
    fiber: {
        type: Number
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
