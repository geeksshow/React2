import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Get user's cart
export async function getUserCart(req, res) {
  try {
    const userId = req.user._id;
    
    let cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'productname description images price stock category subcategory'
      });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message
    });
  }
}

// Add item to cart
export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // Validate product exists and is approved
    const product = await Product.findOne({ 
      _id: productId, 
      status: 'approved', 
      isAvailable: true 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not available"
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if product already exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more items. Total quantity would exceed available stock.`
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price
      });
    }

    await cart.save();

    // Populate product details for response
    await cart.populate({
      path: 'items.product',
      select: 'productname description images price stock category subcategory'
    });

    res.json({
      success: true,
      message: "Item added to cart successfully",
      cart: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message
    });
  }
}

// Update cart item quantity
export async function updateCartItem(req, res) {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    // Check product stock
    const product = await Product.findOne({ 
      _id: productId, 
      status: 'approved', 
      isAvailable: true 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not available"
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate product details for response
    await cart.populate({
      path: 'items.product',
      select: 'productname description images price stock category subcategory'
    });

    res.json({
      success: true,
      message: "Cart item updated successfully",
      cart: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart item",
      error: error.message
    });
  }
}

// Remove item from cart
export async function removeFromCart(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    // Populate product details for response
    await cart.populate({
      path: 'items.product',
      select: 'productname description images price stock category subcategory'
    });

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      cart: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
      error: error.message
    });
  }
}

// Clear entire cart
export async function clearCart(req, res) {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
      cart: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message
    });
  }
}

// Get cart count (for navbar display)
export async function getCartCount(req, res) {
  try {
    const userId = req.user._id;
    
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.json({ count: 0 });
    }

    const count = cart.items.reduce((total, item) => total + item.quantity, 0);
    
    res.json({ count: count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting cart count",
      error: error.message
    });
  }
}
