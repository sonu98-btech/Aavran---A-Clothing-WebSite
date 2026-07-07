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

    res.status(200).json({
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

    await sendTokenResponse(user,res,"user registered successfully")
}