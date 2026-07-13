import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.services.js";
export const createProduct = async (req, res) => {
    const { title, description, priceAmount, priceCurrency } = req.body;

    const seller = req.user

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,

        })
    }))

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        seller: seller._id,
        images
    })

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    })
}

export const getSellerProducts = async (req, res) => {
    const seller = req.user
    const products = await productModel.find({ seller: seller._id })
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products
    })
}

export const getAllProduct = async (req, res) => {
    const products = await productModel.find()
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products
    })
}

export const getProductDetail = async (req, res) => {
    const { productId } = req.params
    const productDetail = await productModel.findById(productId)
    res.status(200).json({
        message: "Product detail fetched",
        success: true,
        productDetail
    })
}
// add product varient routes

export const addVarients = async (req, res) => {
    const seller = req.user._id
    const { proudtId } = req.params
    const product = await productModel.findOne({
        _id: proudtId,
        seller: seller
    })
    if (!product) {
        return res.status(404).json({
            message: "NO product Found",
            success: false,
            sucess: false
        })
    }

    const { price, stock } = req.body
    const files = req.files
    const images = []
    if (files && files.length !== 0) {
        const uploadedImages = await Promise.all(files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
        }))
        images.push(...uploadedImages)
    }
    const attributes = req.body.attributes ? JSON.parse(req.body.attributes) : {}

    product.varients.push({
        images,
        price: price || product.price.amount,
        stock: Number(stock) || 0,
        attributes
    })

    await product.save();

    res.status(201).json({
        message: "Varients added successfully",
        success: true,
        sucess: true,
        varients: product.varients
    })
}