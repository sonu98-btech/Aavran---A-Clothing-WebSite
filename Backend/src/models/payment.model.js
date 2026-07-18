import mongoose from "mongoose";
import priceSchema from "./priceSchema.js";
const paymentSchema = new mongoose.Schema({
    status:{
        type:String,
        enum:["pending","success","failed"],
        required:true,
        default:"pending"
    },
    price:{
        type:priceSchema,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    razorpay:{
        orderId:String,
        paymentId:String,
        signature:String
    },
    orderItems:[{
        title:String,
        description:String,
        productId:mongoose.Schema.Types.ObjectId,
        variantId:mongoose.Schema.Types.ObjectId || null,
        quantity:Number,
        price:priceSchema,
        images:[{
        url:String,
    }]
    }]
    
})

const paymentModel = mongoose.model("Payment",paymentSchema)
export default paymentModel