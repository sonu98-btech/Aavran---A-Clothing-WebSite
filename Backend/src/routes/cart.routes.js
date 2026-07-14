import express from "express"
import { autheticateUser } from "../middlewares/auth.middleware.js"
import {
  getCartController,
  addCartController,
  updateCartItemController,
  removeCartItemController
} from "../controllers/cart.controller.js"
import { addCartValidation } from "../validator/cart.validator.js"

const cartRouter = express.Router()

cartRouter.get("/", autheticateUser, getCartController)
cartRouter.post("/", autheticateUser, addCartValidation, addCartController)
cartRouter.put("/", autheticateUser, updateCartItemController)
cartRouter.delete("/:itemId", autheticateUser, removeCartItemController)

export default cartRouter