import  express from "express";
const addressRouter = express.Router();
import { autheticateUser } from "../middlewares/auth.middleware.js";
import { addNewAddressController,getAllAddressesController,deleteAddressController,updateExistingAddressController,makeAddressDefaultController,getOneAddressController } from "../controllers/address.controller.js";
import { get } from "mongoose";

//add new address
addressRouter.post("/add",autheticateUser,addNewAddressController)
export default addressRouter

// get all addresses
addressRouter.get("/",autheticateUser,getAllAddressesController)

// delete an address
addressRouter.delete("/delete/:addressId",autheticateUser,deleteAddressController)

// update an address
addressRouter.put("/update/:addressId",autheticateUser,updateExistingAddressController)

// make an address default
addressRouter.put("/make-default/:addressId",autheticateUser,makeAddressDefaultController)

// get one address
addressRouter.get("/get/:addressId",autheticateUser,getOneAddressController)