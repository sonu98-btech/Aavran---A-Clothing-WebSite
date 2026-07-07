import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    contact:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["buyer","seller"],
        required:true,
        default:"buyer"
    }
})
 userSchema.pre("save",async ()=>{
    if(!this.isModified('password'))
    return;
    const hash = await bcrypt.hash(this.password,12)
    this.password = hash
 })

 userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password  )
 }


const userModel = mongoose.model("User",userSchema)
export default userModel