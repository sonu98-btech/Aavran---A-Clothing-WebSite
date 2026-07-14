import mongoose from  "mongoose"
import priceSchema from "./priceSchema.js"
 const cartSchema =  new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
            product:{
                 type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            variant:{
                  type: mongoose.Schema.Types.ObjectId,
                  default:null
            },
            quantity:{
                type:Number,
                default:0
            },
            price:{
                type:priceSchema,
            }
        }
    ]
 })

 const cartModel = mongoose.model("Cart",cartSchema)

 export default cartModel