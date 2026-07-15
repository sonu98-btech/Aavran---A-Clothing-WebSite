import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

// Helper to populate cart items product details
const getPopulatedCart = async (userId) => {
  return await cartModel.findOne({ user: userId }).populate({
    path: "items.product",
    select: "title images variants color size description price"
  });
};

export const getCartController = async (req, res) => {
  try {
    const user = req.user._id;
    let cart = await getPopulatedCart(user);
    if (!cart) {
      cart = await cartModel.create({ user, items: [] });
    }
    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addCartController = async (req, res) => {
  try {
    const user = req.user._id;
    const { productId, variantId, quantity } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    let availableStock;
    let selectedPrice;
    let existingItem;

    let cart =
      (await cartModel.findOne({ user: user })) ||
      (await cartModel.create({ user: user, items: [] }));

    if (variantId) {
      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({
          message: "Variant is not available",
          success: false,
        });
      }
      availableStock = variant.stock;
      
      const priceVal = variant.price !== undefined && variant.price !== null ? variant.price : product.price;
      if (typeof priceVal === "number") {
        selectedPrice = {
          amount: priceVal,
          currency: product.price?.currency || "INR"
        };
      } else if (priceVal && priceVal.amount !== undefined) {
        selectedPrice = priceVal;
      } else {
        selectedPrice = {
          amount: 0,
          currency: "INR"
        };
      }

      existingItem = cart.items.find((item) => {
        return item.variant && item.variant.toString() === variantId;
      });
    } else {
      availableStock = product.stock;
      
      const priceVal = product.price;
      if (typeof priceVal === "number") {
        selectedPrice = {
          amount: priceVal,
          currency: "INR"
        };
      } else if (priceVal && priceVal.amount !== undefined) {
        selectedPrice = priceVal;
      } else {
        selectedPrice = {
          amount: 0,
          currency: "INR"
        };
      }

      existingItem = cart.items.find((item) => {
        return item.product.toString() === productId && !item.variant;
      });
    }

    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    if (existingItem) {
      if (existingItem.quantity + quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId || null,
        quantity,
        price: selectedPrice,
      });
    }

    await cart.save();
    const populatedCart = await getPopulatedCart(user);

    return res.status(200).json({
      message: "Item added to cart successfully",
      success: true,
      cart: populatedCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCartItemController = async (req, res) => {
  try {
    const user = req.user._id;
    const { itemId, quantity } = req.body;

    const cart = await cartModel.findOne({ user });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    // Check stock
    const product = await productModel.findById(item.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    let availableStock = product.stock;
    if (item.variant) {
      const variant = product.variants.id(item.variant);
      if (variant) {
        availableStock = variant.stock;
      }
    }

    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items in stock`
      });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await getPopulatedCart(user);
    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: populatedCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const removeCartItemController = async (req, res) => {
  try {
    const user = req.user._id;
    const { itemId } = req.params;

    const cart = await cartModel.findOne({ user });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    const populatedCart = await getPopulatedCart(user);
    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
