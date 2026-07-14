import mongoose from "mongoose";
import priceSchema from "./priceSchema.js";
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    color:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    images: [{
        url: {
            type: String,
            required: true
        }
    }],
    price: {
        type:priceSchema,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    variants: [{
        images: [
            {
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        size: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            default: 0
        },
        price: {
            type: Number || priceSchema,
        },
        attributes: {
            type: Map,
            of: String
        }
    }]
}, { timestamps: true })

const productModel = mongoose.model("Product", productSchema)
export default productModel