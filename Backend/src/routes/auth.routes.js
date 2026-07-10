import express from 'express';
import { registerValidator,loginValidator } from '../validator/auth.validator.js';
import { registerController,loginController,googleAuthCallbackController,getMe} from '../controllers/auth.controller.js';
import passport from 'passport';
import { autheticateUser } from '../middlewares/auth.middleware.js';
const authRouter  = express.Router();

authRouter.post("/register",registerValidator, registerController)
authRouter.post("/login",loginValidator, loginController)

authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get("/google/callback",
  passport.authenticate('google', { session: false, failureRedirect: "http://localhost:5173/login" }),googleAuthCallbackController);

authRouter.get("/",autheticateUser,getMe)
  export default authRouter