import express from 'express';
const productRouter  = express.Router();
import productModel from '../models/product.model.js';
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import multer from 'multer';
import { createProductValidator } from '../validator/product..validation.js';
import { createProduct, getSellerProducts,getAllProduct,getProductDetail} from '../controllers/product.controller.js';
 
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
})
// create new product route
productRouter.post("/",upload.array("images", 5),createProductValidator,authenticateSeller,createProduct)
//get seller all product route
productRouter.get("/seller",authenticateSeller,getSellerProducts)

// get all seller all product route
productRouter.get("/",getAllProduct)

// get Product Detail
productRouter.get("/:productId",getProductDetail)

export default productRouter