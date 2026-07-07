import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js"

async function sendTokenResponse(user,res,message){
    const token = jwt.sign({
        id:user._id,
    },config.JWT_SECRET,{
        expiresIn:1*24*60*60
    })
    res.cookie("token",token)

    return res.status(200).json({
        success:true,
        message:message,
        user:{
            id:user._id,
            email:user.email,
            contact:user.contact,
            fullname:user.fullname,
            role:user.role
        },
    })
}
export const registerController = async(req,res)=>{
    const {email,contact,password,fullname,isSeller} = req.body;
    const isUserExist = await userModel.findOne({
        $or:[
            {email:email},
            {contact:contact}
        ]
    })
    if(isUserExist){
        return res.status(400).json({message:"User already exists"})    
    }
    const user = await userModel.create({
        email,
        contact,
        password,
        fullname,
        role:isSeller?"seller":"buyer"
    })
    console.log("user : ", user)

    await sendTokenResponse(user,res,"user registered successfully")
}

export const loginController = async(req,res)=>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email:email})
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"})
    }
    await sendTokenResponse(user,res,"user logged in successfully")
}