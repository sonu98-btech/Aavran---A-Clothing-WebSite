import express from 'express';
import { registerValidator } from '../validator/auth.validator.js';
import { registerController } from '../controllers/auth.controller.js';
const authRouter  = express.Router();

authRouter.post("/register",registerValidator, registerController)

export default authRouter