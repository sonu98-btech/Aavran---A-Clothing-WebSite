import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { createOrder } from "../services/payment.service.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

// Helper to populate cart items using aggregation pipeline
const getPopulatedCart = async (userId) => {
  const userObjectId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  let cart = await cartModel.findOne({ user: userObjectId });
  if (!cart) {
    cart = await cartModel.create({ user: userObjectId, items: [] });
  }

  if (!cart.items || cart.items.length === 0) {
    return {
      _id: cart._id,
      user: cart.user,
      items: [],
      subAmount: 0,
      gst: 0,
      shipping: 0,
      total: 0,
      currency: "INR",
    };
  }

  const result = await cartModel.aggregate(
    [
      {
        $match: {
          user: userObjectId,
        },
      },
      { $unwind: { path: "$items" } },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "items.product",
        },
      },
      { $unwind: { path: "$items.product" } },
      {
        $addFields: {
          selectedVariant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$items.product.variants",
                  as: "variant",
                  cond: {
                    $eq: ["$$variant._id", "$items.variant"],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          unitPrice: {
            $cond: {
              if: { $eq: ["$items.variant", null] },
              then: "$items.product.price.amount",
              else: "$selectedVariant.price",
            },
          },
        },
      },
      {
        $addFields: {
          itemPrice: {
            $multiply: ["$items.quantity", "$unitPrice"],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          subAmount: { $sum: "$itemPrice" },
          currency: {
            $first: "$items.product.price.currency",
          },
          items: {
            $push: {
              _id: "$items._id",
              product: "$items.product",
              variant: "$items.variant",
              quantity: "$items.quantity",
              price: "$items.price",
              unitPrice: "$unitPrice",
              itemPrice: "$itemPrice",
            },
          },
        },
      },
      {
        $addFields: {
          gst: {
            $round: [{ $multiply: ["$subAmount", 0.18] }, 0],
          },
          shipping: {
            $cond: {
              if: { $lt: ["$subAmount", 1400] },
              then: 99,
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          total: {
            $round: [
              {
                $add: ["$subAmount", "$gst", "$shipping"],
              },
              0,
            ],
          },
        },
      },
    ],
    { maxTimeMS: 60000, allowDiskUse: true },
  );

  if (result.length > 0) {
    return result[0];
  }

  return {
    _id: cart._id,
    user: cart.user,
    items: [],
    subAmount: 0,
    gst: 0,
    shipping: 0,
    total: 0,
    currency: "INR",
  };
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
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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

      const priceVal =
        variant.price !== undefined && variant.price !== null
          ? variant.price
          : product.price;
      if (typeof priceVal === "number") {
        selectedPrice = {
          amount: priceVal,
          currency: product.price?.currency || "INR",
        };
      } else if (priceVal && priceVal.amount !== undefined) {
        selectedPrice = priceVal;
      } else {
        selectedPrice = {
          amount: 0,
          currency: "INR",
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
          currency: "INR",
        };
      } else if (priceVal && priceVal.amount !== undefined) {
        selectedPrice = priceVal;
      } else {
        selectedPrice = {
          amount: 0,
          currency: "INR",
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
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Check stock
    const product = await productModel.findById(item.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
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
        message: `Only ${availableStock} items in stock`,
      });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await getPopulatedCart(user);
    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    const populatedCart = await getPopulatedCart(user);
    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createOrderController = async (req, res) => {
  const cart = await getPopulatedCart(req.user._id);
  if (!cart || !cart.items || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }
  const order = await createOrder({
    amount: cart.total,
    currency: cart.currency,
  });
  const payment = await paymentModel.create({
    user: req.user._id,
    price: {
      amount: cart.total,
      currency: cart.currency,
    },
    razorpay: {
      orderId: order.id,
    },
    orderItems: cart.items.map((item) => {
      const selectedVariant = item.variant
        ? item.product.variants?.find(
            (variant) => variant._id.toString() === item.variant.toString(),
          )
        : null;
      const itemImages = selectedVariant?.images?.length
        ? selectedVariant.images
        : item.product.images || [];

      return {
        title: item.product.title,
        description: item.product.description,
        productId: item.product._id,
        variantId: item.variant || null,
        quantity: item.quantity,
        price: item.price,
        images: itemImages.map((img) => ({ url: img.url })),
      };
    }),
  });
  return res.status(200).json({
    success: true,
    order,
  });
};

export const verifyOrderController = async (req, res) => {
  console.log("verifyOrderController hit with body:", req.body);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const payment = await paymentModel.findOne({
    "razorpay.orderId": razorpay_order_id,
    status: "pending",
  });
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }
  const isPaymentValid = validatePaymentVerification(
    {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    config.RAZORPAY_KEY_SECRET,
  );
  if (!isPaymentValid) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
  payment.razorpay.paymentId = razorpay_payment_id;
  payment.razorpay.signature = razorpay_signature;
  payment.status = "success";
  await payment.save();
  // Update product and variant stock after successful payment
  for (const item of payment.orderItems) {
    const product = await productModel.findById(item.productId);
    if (!product) {
      continue; // Skip if product not found
    }
    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      if (variant) {
        variant.stock -= item.quantity;
      }
    } else {
      product.stock -= item.quantity;
    }
    await product.save();
  }
  // Clear the cart after successful payment
  await cartModel.findOneAndUpdate({ user: req.user._id }, { items: [] });
  return res.status(200).json({
    success: true,
    message: "Payment verified and order completed",
  });
};
