import express from 'express';
import { registerValidator,loginValidator } from '../validator/auth.validator.js';
import { registerController,loginController } from '../controllers/auth.controller.js';
const authRouter  = express.Router();

authRouter.post("/register",registerValidator, registerController)
authRouter.post("/login",loginValidator, loginController)
export default authRouter