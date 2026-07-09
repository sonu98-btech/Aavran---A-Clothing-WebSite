import express from 'express';
const productRouter  = express.Router();
import productModel from '../models/product.model.js';
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import multer from 'multer';
import { createProductValidator } from '../validator/product..validation.js';
import { createProduct } from '../controllers/product.controller.js';
 
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
})
productRouter.post("/",upload.array("images", 5),authenticateSeller,createProductValidator,createProduct)

export default productRouter